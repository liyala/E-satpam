import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormPengaduan = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    kategori: '',
    judul: '',
    deskripsi: '',
    prioritas: 'sedang'
  });

  const [alert, setAlert] = useState({
    visible: false,
    color: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/listpengaduan', formData);
      
      setAlert({
        visible: true,
        color: 'success',
        message: 'Pengaduan berhasil dikirim!. Aduan Anda Akan Segera di Tindaklanjuti'
      });

      // Reset form
      setFormData({
        nama: '',
        email: '',
        telepon: '',
        kategori: '',
        judul: '',
        deskripsi: '',
        prioritas: 'sedang'
      });

      // Sembunyikan alert setelah 5 detik
      setTimeout(() => {
        setAlert({ visible: false, color: '', message: '' });
      }, 5000);

    } catch (error) {
      setAlert({
        visible: true,
        color: 'danger',
        message: 'Terjadi kesalahan saat mengirim pengaduan.'
      });
    }
  };

  return (
    <Container className="mt-4">
        <Button style={{marginBottom :"10px"}} 
                color="success" href="/" > Kembali </Button>
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card>
            <CardHeader className="bg-success text-white">
              <h4 className="mb-0">Form Pengaduan</h4>
            </CardHeader>
            <CardBody>
              {alert.visible && (
                <Alert color={alert.color}>
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="nama">Nama Lengkap *</Label>
                      <Input
                        type="text"
                        name="nama"
                        id="nama"
                        placeholder="Masukkan nama lengkap"
                        value={formData.nama}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="email">Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Masukkan email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="telepon">Nomor Telepon *</Label>
                      <Input
                        type="tel"
                        name="telepon"
                        id="telepon"
                        placeholder="Masukkan nomor telepon"
                        value={formData.telepon}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="kategori">Kategori Pengaduan *</Label>
                      <Input
                        type="select"
                        name="kategori"
                        id="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        
                        <option value="Teknisi">Teknis</option>
                        <option disabled>───────────────────────</option>
                        <option value="Kehilangan">Kehilangan</option>
                        <option value="Administrasi">Administrasi</option>
                        <option value="Keuangan">Keuangan</option>
                        <option value="Pelayanan">Pelayanan</option>
                        <option value="Lainnya">Lainnya</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="judul">Judul Pengaduan *</Label>
                  <Input
                    type="text"
                    name="judul"
                    id="judul"
                    placeholder="Masukkan judul pengaduan"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="deskripsi">Deskripsi Pengaduan *</Label>
                  <Input
                    type="textarea"
                    name="deskripsi"
                    id="deskripsi"
                    rows="5"
                    placeholder="Jelaskan detail pengaduan Anda"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="prioritas">Tingkat Urgensi</Label>
                  <Input
                    type="select"
                    name="prioritas"
                    id="prioritas"
                    value={formData.prioritas}
                    onChange={handleChange}
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                    
                  </Input>
                </FormGroup>

                <div className="d-grid gap-2">
                  <Button color="success" size="lg" type="submit">
                    Kirim Pengaduan
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormPengaduan;