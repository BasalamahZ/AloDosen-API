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
    type: String,
  },
  topik: {
    type: String,
  },
  ulasan: {
    type: String,
  },
  tarif: {
    type: String,
  },
  totalKonsultasi: {
    type: String,
  },
});

module.exports = mongoose.model("Dosen", DosenSchema);
