const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js")[
  process.env.NODE_ENV || "development"
];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    namaLengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tanggalLahir: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    jenisKelamin: {
      type: DataTypes.ENUM("Laki-laki", "Perempuan"),
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomorTelepon: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("dokter", "admin", "staff", "pasien"),
      allowNull: false,
      defaultValue: "pasien",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Appointment Model
const Appointment = sequelize.define("appointments", {
  appointment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pasien_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  dokter_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Changed to allow null for staff assignment
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  tanggal_appointment: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
    defaultValue: 'pending',
  },
  keluhan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Optional: Add medical notes field
  medical_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Optional: Add staff_id for tracking who processed the appointment
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  tableName: 'appointments',
  timestamps: true,
});

// Update associations to include staff
User.hasMany(Appointment, { 
  as: 'pasienAppointments', 
  foreignKey: 'pasien_id' 
});
User.hasMany(Appointment, { 
  as: 'dokterAppointments', 
  foreignKey: 'dokter_id' 
});
User.hasMany(Appointment, { 
  as: 'staffAppointments', 
  foreignKey: 'staff_id' 
});
Appointment.belongsTo(User, { 
  as: 'pasien', 
  foreignKey: 'pasien_id' 
});
Appointment.belongsTo(User, { 
  as: 'dokter', 
  foreignKey: 'dokter_id' 
});
Appointment.belongsTo(User, { 
  as: 'staff', 
  foreignKey: 'staff_id' 
});

// Sync the models with the database
sequelize.sync();

module.exports = {
  sequelize,
  User,
  Appointment,
};