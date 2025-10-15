import React, { useState, useEffect } from 'react';
import {
  Container,Row,Col,Card,CardBody,CardHeader,Table,Badge,Button,Input,FormGroup,Label,Modal,ModalHeader,ModalBody,ModalFooter,Alert,Spinner
} from 'reactstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const ListPengaduan = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterPriority, setFilterPriority] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({ visible: false, color: '', message: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/listpengaduan');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setAlert({
        visible: true,
        color: 'danger',
        message: 'Gagal memuat data pengaduan'
      });
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      baru: { color: 'primary', text: 'Baru' },
      diproses: { color: 'warning', text: 'Diproses' },
      selesai: { color: 'success', text: 'Selesai' }
    };
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      rendah: { color: 'success', text: 'Rendah' },
      sedang: { color: 'warning', text: 'Sedang' },
      tinggi: { color: 'danger', text: 'Tinggi' }
    };
    const config = priorityConfig[priority] || { color: 'secondary', text: priority, };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const getCategoryBadge = (kategori) => {
    const categoryConfig = {
      teknisi: { color: 'info', text: 'Teknis' },
      administrasi: { color: 'secondary', text: 'Administrasi' },
      keuangan: { color: 'success', text: 'Keuangan' },
      pelayanan: { color: 'primary', text: 'Pelayanan' },
      lainnya: { color: 'dark', text: 'Lainnya' }
    };
    const config = categoryConfig[kategori] || { color: 'dark', text: kategori };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === "semua" || complaint.status === filterStatus;
    const matchesPriority = filterPriority === "semua" || complaint.prioritas === filterPriority;
    const matchesSearch =
      complaint.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  }).sort((a, b) => {
    if (a.status === "selesai" && b.status !== "selesai") return 1;
    if (a.status !== "selesai" && b.status === "selesai") return -1;
    return 0;
  });

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/listpengaduan/${id}`, { status: newStatus });
      setAlert({
        visible: true,
        color: 'success',
        message: 'Status pengaduan berhasil diperbarui'
      });
      fetchComplaints();
      setModalOpen(false);
    } catch (error) {
      setAlert({
        visible: true,
        color: 'danger',
        message: 'Gagal memperbarui status pengaduan'
      });
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="mt-2">Memuat data pengaduan...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
    <Button style={{marginBottom :"10px"}} 
    color="success" href="/" > Kembali </Button>
      <Row>
        <Col>
          <Card>
            <CardHeader className="bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Daftar Pengaduan RS Petro Graha Medika</h4>
              <Badge color="light" className="text-success">
                Total: {filteredComplaints.length}
              </Badge>
            </CardHeader>
            <CardBody>
              {alert.visible && (
                <Alert color={alert.color} className="mb-3">
                  {alert.message}
                </Alert>
              )}

              {/* Filter dan Pencarian */}
              <Row className="mb-3">
                <Col md="4">
                  <FormGroup>
                    <Label for="search">Cari Pengaduan</Label>
                    <Input
                      type="text"
                      id="search"
                      placeholder="Cari berdasarkan judul, nama, atau deskripsi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="statusFilter">Filter Status</Label>
                    <Input
                      type="select"
                      id="statusFilter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="semua">Semua Status</option>
                      <option value="baru">Baru</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="priorityFilter">Filter Prioritas</Label>
                    <Input
                      type="select"
                      id="priorityFilter"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="semua">Semua Prioritas</option>
                      <option value="rendah">Rendah</option>
                      <option value="sedang">Sedang</option>
                      <option value="tinggi">Tinggi</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              {/* Tabel Pengaduan */}
              <div className="table-responsive">
                <Table striped hover bordered>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Tanggal</th>
                      <th>Nama</th>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Prioritas</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          Tidak ada data pengaduan
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((complaint, index) => (
                        <tr key={complaint.id}>
                          <td>{index + 1}</td>
                          <td>
                            <small>
                              {new Date(complaint.tanggal_dibuat).toLocaleDateString('id-ID')}
                            </small>
                          </td>
                          <td>{complaint.nama}</td>
                          <td>
                            <div className="fw-bold">{complaint.judul}</div>
                            <small className="text-muted">
                              {complaint.deskripsi.substring(0, 50)}...
                            </small>
                          </td>
                          <td>{getCategoryBadge(complaint.kategori)}</td>
                          <td>{getPriorityBadge(complaint.prioritas)}</td>
                          <td>{getStatusBadge(complaint.status)}</td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              onClick={() => viewComplaintDetails(complaint)}
                            >
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal Detail Pengaduan */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Detail Pengaduan
        </ModalHeader>
        <ModalBody>
          {selectedComplaint && (
            <Row>
              <Col md="6">
                <strong>Nama Pelapor:</strong>
                <p>{selectedComplaint.nama}</p>
              </Col>
              <Col md="6">
                <strong>Email:</strong>
                <p>{selectedComplaint.email}</p>
              </Col>
              <Col md="6">
                <strong>Telepon:</strong>
                <p>{selectedComplaint.telepon || '-'}</p>
              </Col>
              <Col md="6">
                <strong>Kategori:</strong>
                <p>{getCategoryBadge(selectedComplaint.kategori)}</p>
              </Col>
              <Col md="6">
                <strong>Prioritas:</strong>
                <p>{getPriorityBadge(selectedComplaint.prioritas)}</p>
              </Col>
              <Col md="6">
                <strong>Status:</strong>
                <p>{getStatusBadge(selectedComplaint.status)}</p>
              </Col>
              <Col md="12">
                <strong>Judul Pengaduan:</strong>
                <p className="fw-bold">{selectedComplaint.judul}</p>
              </Col>
              <Col md="12">
                <strong>Deskripsi Lengkap:</strong>
                <div className="border p-3 rounded bg-light">
                  {selectedComplaint.deskripsi}
                </div>
              </Col>
              <Col md="12" className="mt-2">
                <strong>Tanggal Dibuat:</strong>
                <p>{formatDate(selectedComplaint.tanggal_dibuat)}</p>
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          {selectedComplaint && selectedComplaint.status !== 'diproses' && (
            <Button 
              color="warning" 
              onClick={() => updateComplaintStatus(selectedComplaint.id, 'diproses')}
            >
              Tandai Diproses
            </Button>
          )}
          {selectedComplaint && selectedComplaint.status !== 'selesai' && (
            <Button 
              color="success" 
              onClick={() => updateComplaintStatus(selectedComplaint.id, 'selesai')}
            >
              Tandai Selesai
            </Button>
          )}
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Tutup
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};
export default ListPengaduan;