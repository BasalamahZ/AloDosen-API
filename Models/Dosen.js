const mongoose = require("mongoose");

const DosenSchema = mongoose.Schema({
  image: {
    type: String,
  },
  namaLengkap: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profil: {
    type: String,
  },
  lokasiJadwal: [
    {
      hari: String,
      lokasi: String,
      jam: String,
    },
  ],
  topik: {
    type: Array,
  },
  pendidikan: {
    type: Array,
  },
  universitas: {
    type: String,
  },
  fakultas: {
    type: String,
  },
  jurusan: {
    type: String,
  },
  lokasi: {
    type: String,
  },
  noTelp: {
    type: Number,
  },
  ulasan: {
    type: Array,
  },
  tarif: {
    type: String,
  },
  totalKonsultasi: {
    type: String,
  },
});

module.exports = mongoose.model("Dosen", DosenSchema);
