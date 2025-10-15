import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import axios from 'axios';

const AddLaporanmulti = () => {
  const [formData, setFormData] = useState({
    nama_penjaga: '',
    judul_laporan: '',
    lokasi: '',
    shift: '',
    hari: '',
    jam: '',
    tanggal: '',
    detail_laporan: ''
  });
  
  const [foto, setFoto] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios
    .get("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setFormData((prev) => ({ ...prev, nama_penjaga: res.data.username }));
    })
    .catch((err) => console.error("Gagal ambil profil:", err));
}, []);

  const ruanganOptions = [
    { value: 'Gedung Lama', label: 'Gedung Lama' },
    { value: 'Instalasi Gawat Darurat', label: 'Instalasi Gawat Darurat' },
    { value: 'Abhipraya', label: 'Abhipraya' },
    { value: 'Abhinaya', label: 'Abhinaya' },
    { value: 'Abyakta', label: 'Abyakta' },
  ];

  const shiftOptions = [
    { value: 'pagi', label: 'Pagi' },
    { value: 'siang', label: 'Siang' },
    { value: 'malam', label: 'Malam' }
  ];

  const hariOptions = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFoto(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // 🔹 Nama penjaga tidak dikirim, backend ambil otomatis
      Object.keys(formData).forEach((key) => {
        if (key !== "nama_penjaga") data.append(key, formData[key]);
      });
      foto.forEach((file) => {
        data.append('foto', file);
      });

      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/laporan', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setAlert({ show: true, type: 'success', message: response.data.message });

      // Reset field kecuali nama_penjaga
      setFormData({
        nama_penjaga: formData.nama_penjaga,
        judul_laporan: '',
        lokasi: '',
        shift: '',
        hari: '',
        jam: '',
        tanggal: '',
        detail_laporan: ''
      });
      setFoto([]);

      const fileInput = document.getElementById('foto');
      if (fileInput) fileInput.value = '';

      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error menyimpan laporan: ' + (error.response?.data?.error || error.message)
      });
    }
  };

  return (
    <Container className="mt-4">
      <Button style={{marginBottom :"10px"}} 
      color="success" href="/" > Kembali </Button>
      <Row className="justify-content-center">
        <Col md="8">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Form Input Laporan</h4>
            </CardHeader>
            <CardBody>
              {alert.show && <Alert color={alert.type}>{alert.message}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* ✅ Nama Penjaga (Otomatis, Readonly) */}
                <FormGroup>
                  <Label for="nama_penjaga">Nama Penjaga</Label>
                  <Input
                  readOnly 
                    type="text"
                    name="nama_penjaga"
                    id="nama_penjaga"
                    value={formData.nama_penjaga}
                    
                  />
                  <small className="text-muted">
                    Nama otomatis sesuai akun yang login
                  </small>
                </FormGroup>

                {/* Judul Laporan */}
                <FormGroup>
                  <Label for="judul_laporan">Judul Laporan</Label>
                  <Input
                    type="text"
                    name="judul_laporan"
                    id="judul_laporan"
                    placeholder="Masukkan judul laporan"
                    value={formData.judul_laporan}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                {/* Lokasi & Shift */}
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="lokasi">Lokasi</Label>
                      <Input
                        type="select"
                        name="lokasi"
                        id="lokasi"
                        value={formData.lokasi}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Ruangan</option>
                        {ruanganOptions.map((ruang) => (
                          <option key={ruang.value} value={ruang.value}>
                            {ruang.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label for="shift">Shift</Label>
                      <Input
                        type="select"
                        name="shift"
                        id="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Shift</option>
                        {shiftOptions.map((shift) => (
                          <option key={shift.value} value={shift.value}>
                            {shift.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Hari, Jam, dan Tanggal */}
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label for="hari">Hari</Label>
                      <Input
                        type="select"
                        name="hari"
                        id="hari"
                        value={formData.hari}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Pilih Hari</option>
                        {hariOptions.map((hari) => (
                          <option key={hari} value={hari}>
                            {hari}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label for="jam">Jam</Label>
                      <Input
                        type="time"
                        name="jam"
                        id="jam"
                        value={formData.jam}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label for="tanggal">Tanggal</Label>
                      <Input
                        type="date"
                        name="tanggal"
                        id="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Detail Laporan */}
                <FormGroup>
                  <Label for="detail_laporan">Detail Laporan</Label>
                  <Input
                    type="textarea"
                    name="detail_laporan"
                    id="detail_laporan"
                    placeholder="Masukkan detail laporan..."
                    rows="7"
                    value={formData.detail_laporan}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                {/* Upload Foto */}
                <FormGroup>
                  <Label for="foto">Upload Foto (Pastikan Foto yang di pilih Sudah Benar)</Label>
                  <Input
                    type="file"
                    name="foto"
                    id="foto"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="form-text text-muted">
                    {foto.length > 0
                      ? `${foto.length} file dipilih: ${foto.map(f => f.name).join(' ,  ')}`
                      : "Belum ada file dipilih"}
                  </small>
                </FormGroup>

                {/* Tombol Submit */}
                <Button color="success" type="submit" size="lg" block>
                  Simpan Laporan
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddLaporanmulti;
