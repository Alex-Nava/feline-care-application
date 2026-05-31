const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Household = require('../models/Household');

// Clave secreta temporal para los tokens JWT (Para producción se usa .env)
const JWT_SECRET = 'MICHI_MILLONARIO_SECRET_KEY';

// 1. REGISTRO: Crea un usuario y le genera un Hogar Automático
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        let userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ msg: 'El correo ya está registrado' });

        // Encriptar contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generar código de invitación único de 6 dígitos para el hogar
        const randomCode = 'MICH-' + Math.floor(1000 + Math.random() * 9000);

        // Crear el nuevo Hogar automáticamente en modo FREE
        const newHousehold = await Household.create({ invite_code: randomCode });

        // Crear el Usuario amarrado a ese hogar
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            householdId: newHousehold.id
        });

        // Generar Token de sesión para el celular
        const token = jwt.sign({ userId: newUser.id, householdId: newHousehold.id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ token, user: { name: newUser.name, email: newUser.email }, inviteCode: randomCode });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el registro');
    }
});

// 2. UNIRSE A HOGAR: Aquí disparamos el candado de monetización 💸
router.post('/join-household', async (req, res) => {
    try {
        const { userId, inviteCode } = req.body;

        // Buscar si el hogar con ese código existe
        const targetHousehold = await Household.findOne({ where: { invite_code: inviteCode } });
        if (!targetHousehold) return res.status(404).json({ msg: 'Código de hogar no encontrado' });

        // Contar cuántos integrantes ya tiene ese hogar actualmente
        const memberCount = await User.count({ where: { householdId: targetHousehold.id } });

        // APLICAR REGLA DE NEGOCIO FREE VS VIP
        if (targetHousehold.plan_type === 'FREE' && memberCount >= 2) {
            return res.status(403).json({ 
                msg: '¡Límite alcanzado! Este hogar ya tiene 2 cuidadores en el plan gratuito. Pásate a VIP para añadir a toda la familia. 👑' 
            });
        }

        // Si pasa la validación, vinculamos al usuario al hogar compartido
        const user = await User.findByPk(userId);
        user.householdId = targetHousehold.id;
        await user.save();

        res.json({ msg: 'Te has unido al hogar con éxito', householdId: targetHousehold.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al unirse al hogar');
    }
});

// 3. LOGIN TRADICIONAL
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const token = jwt.sign({ userId: user.id, householdId: user.householdId }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ token, user: { name: user.name, email: user.email, householdId: user.householdId } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el login');
    }
});

module.exports = router;