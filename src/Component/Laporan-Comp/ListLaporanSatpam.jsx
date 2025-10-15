import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardHeader, Input, FormGroup,
  Label, Button, Spinner, Alert, Modal, ModalHeader, ModalBody
} from "reactstrap";
import axios from "axios";

const LaporanList = () => {
  // ---- Hooks (semua di dalam komponen) ----
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shift, setShift] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("");

  // Edit (nested modal)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    judul_laporan: "",
    lokasi: "",
    shift: "",
    hari: "",
    jam: "",
    tanggal: "",
    detail_laporan: "",
  });

  // ---- Fetch laporan ----
  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const params = {};
      if (shift) params.shift = shift;
      if (tanggal) params.tanggal = tanggal;
      if (lokasi) params.lokasi = lokasi;

      const res = await axios.get("http://localhost:5000/api/laporan", { params });
      const data = res.data.map((it) => ({
        ...it,
        foto: it.foto ? (typeof it.foto === "string" ? JSON.parse(it.foto) : it.foto) : [],
      }));
      setLaporan(data);
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);
      setAlert({ show: true, message: "Gagal mengambil data laporan", type: "danger" });
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    fetchLaporan();
  }, []);

  // ---- Handlers umum ----
  const handleFilter = (e) => {
    e?.preventDefault();
    fetchLaporan();
  };

  const handleReset = () => {
    setShift("");
    setTanggal("");
    setLokasi("");
    fetchLaporan();
  };

  const handleOpenModal = (laporanItem) => {
    setSelectedLaporan(laporanItem);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLaporan(null);
  };

  // ---- Handlers edit (nested modal) ----
  const handleEdit = (laporanItem) => {
    setEditData({
      judul_laporan: laporanItem.judul_laporan || "",
      lokasi: laporanItem.lokasi || "",
      shift: laporanItem.shift || "",
      hari: laporanItem.hari || "",
      jam: laporanItem.jam || "",
      tanggal: laporanItem.tanggal
        ? new Date(laporanItem.tanggal).toISOString().split("T")[0]
        : "",
      detail_laporan: laporanItem.detail_laporan || "",
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLaporan) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        `http://localhost:5000/api/laporan/${selectedLaporan.id}`,
        editData,
        { headers }
      );

      setSelectedLaporan((prev) => (prev ? { ...prev, ...editData } : prev));
      fetchLaporan();
      setEditModalOpen(false);

      setAlert({ show: true, message: "Laporan berhasil diperbarui", type: "success" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3500);
    } catch (error) {
      console.error("Gagal update laporan:", error);
      setAlert({ show: true, message: "Gagal memperbarui laporan", type: "danger" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3500);
    }
  };
  const handleDelete = async (id) => {
  if (!window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;

  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    await axios.delete(`http://localhost:5000/api/laporan/${id}`, { headers });

    setAlert({
      show: true,
      message: "Laporan berhasil dihapus",
      type: "success",
    });

    setModalOpen(false);
    fetchLaporan();

    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  } catch (err) {
    console.error("Gagal menghapus laporan:", err);
    setAlert({
      show: true,
      message: "Gagal menghapus laporan",
      type: "danger",
    });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  }
};


  // ---- JSX ----
  return (
    <Container className="mt-4">
      <Button style={{ marginBottom: "10px" }} color="success" href="/">
        Kembali
      </Button>
      <Card className="shadow-sm">
        <CardHeader>
          <h4 className="mb-0" >Daftar Laporan Satpam</h4>
        </CardHeader>
        <CardBody>
          {alert.show && (
            <Alert color={alert.type === "danger" ? "danger" : "success"}>
              {alert.message}
            </Alert>
          )}

          {/* Filter */}
          <FormGroup>
            <Row className="align-items-end g-2">
              <Col md="3">
                <Label>Filter Shift</Label>
                <Input type="select" value={shift} onChange={(e) => setShift(e.target.value)}>
                  <option value="">Semua Shift</option>
                  <option value="pagi">Pagi</option>
                  <option value="siang">Siang</option>
                  <option value="malam">Malam</option>
                </Input>
              </Col>

              <Col md="3">
                <Label>Filter Lokasi</Label>
                <Input type="select" value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
                  <option value="">Semua Lokasi</option>
                  <option value="Gedung Lama">Gedung Lama</option>
                  <option value="Instalasi Gawat Darurat">Instalasi Gawat Darurat</option>
                  <option value="Abhipraya">Abhipraya</option>
                  <option value="Abhinaya">Abhinaya</option>
                  <option value="Abyakta">Abyakta</option>
                </Input>
              </Col>

              <Col md="3">
                <Label>Filter Tanggal</Label>
                <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </Col>

              <Col md="3" className="d-flex gap-2">
                <Button color="success" onClick={handleFilter}>
                  Terapkan Filter
                </Button>
                <Button color="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </FormGroup>

          {/* Loading / Empty State / List */}
          {loading ? (
            <div className="text-center mt-4">
              <Spinner color="primary" />
            </div>
          ) : laporan.length === 0 ? (
            <Alert color="warning" className="mt-3">
              Tidak ada laporan ditemukan
            </Alert>
          ) : (
            <Row className="mt-3 g-4">
              {laporan.map((item) => (
                <Col
                  key={item.id}
                  xs="12"
                  sm="6"
                  md="4"
                  onClick={() => handleOpenModal(item)}
                  style={{ cursor: "pointer" }}
                >
                  <Card className="h-100 shadow-lg border-0">
                    {item.foto && item.foto.length > 0 && (
                      <img
                        src={`http://localhost:5000${item.foto[0]}`}
                        alt="thumbnail"
                        className="card-img-top"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderTopLeftRadius: "0.5rem",
                          borderTopRightRadius: "0.5rem",
                        }}
                      />
                    )}
                    <CardBody>
                      <h6 className="fw-bold text-dark mb-1">{item.judul_laporan}</h6>
                      <p className="text-muted mb-1">
                        <strong>{item.nama_penjaga}</strong> • {item.shift}
                      </p>
                      <p className="text-muted mb-1">
                        <small>
                          {item.tanggal} • {item.lokasi}
                        </small>
                      </p>
                      <p className="text-truncate mb-0">
                        {item.detail_laporan.substring(0, 100)}...
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </CardBody>
      </Card>

      {/* Modal Detail */}
      {selectedLaporan && (
        <Modal isOpen={modalOpen} toggle={handleCloseModal} size="lg" centered>
          <ModalHeader toggle={handleCloseModal}>
            Detail Laporan — {selectedLaporan.judul_laporan}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <p><strong>Nama Penjaga:</strong> {selectedLaporan.nama_penjaga}</p>
                <p><strong>Lokasi:</strong> {selectedLaporan.lokasi}</p>
                <p><strong>Shift:</strong> {selectedLaporan.shift}</p>
              </Col>
              <Col md="6">
                <p><strong>Hari:</strong> {selectedLaporan.hari}</p>
                <p><strong>Jam:</strong> {selectedLaporan.jam}</p>
                <p><strong>Tanggal:</strong> {selectedLaporan.tanggal}</p>
              </Col>
            </Row>

            <p className="mt-1"><strong>Detail Laporan:</strong></p>
            
            <Input
                type="textarea"
                name="detail_laporan"
                rows="15"
                value={selectedLaporan.detail_laporan}
                disabled
              />
            {/* <p>{selectedLaporan.detail_laporan}</p> */}

            {selectedLaporan.foto && selectedLaporan.foto.length > 0 && (
              <>
          <hr />
                <h6>Foto Dokumentasi:</h6>
                <Row>
                  {selectedLaporan.foto.map((img, idx) => (
                    <Col md="4" key={idx} className="mb-3">
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`foto-${idx}`}
                        className="img-fluid rounded shadow-sm border"
                      />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          <hr/>
            
            <div className="d-flex justify-content-end gap-3 mt-2">
              {role === "admin" && (
              <Button color="danger" onClick={() => handleDelete(selectedLaporan.id)}>
                Hapus
              </Button>
                )}
              <Button color="warning" onClick={() => handleEdit(selectedLaporan)}>
                Update Laporan
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Nested Modal Update */}
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} size="lg" centered>
        <ModalHeader toggle={() => setEditModalOpen(false)}>Edit Laporan</ModalHeader>
        <ModalBody>
          <form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md="6">
                <Label>Judul Laporan</Label>
                <Input
                  type="text"
                  name="judul_laporan"
                  value={editData.judul_laporan}
                  onChange={handleEditChange}
                  required
                />
              </Col>
              <Col md="6">
                <Label>Lokasi</Label>
                <Input
                  type="select"
                  name="lokasi"
                  value={editData.lokasi}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  <option value="Gedung Lama">Gedung Lama</option>
                  <option value="Instalasi Gawat Darurat">Instalasi Gawat Darurat</option>
                  <option value="Abhipraya">Abhipraya</option>
                  <option value="Abhinaya">Abhinaya</option>
                  <option value="Abyakta">Abyakta</option>
                </Input>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md="4">
                <Label>Shift</Label>
                <Input
                  type="select"
                  name="shift"
                  value={editData.shift}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Pilih Shift</option>
                  <option value="pagi">Pagi</option>
                  <option value="siang">Siang</option>
                  <option value="malam">Malam</option>
                </Input>
              </Col>
              <Col md="4">
                <Label>Hari</Label>
                <Input
                  type="select"
                  name="hari"
                  value={editData.hari}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Pilih hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </Input>
              </Col>
              <Col md="4">
                <Label>Jam</Label>
                <Input
                  type="time"
                  name="jam"
                  value={editData.jam}
                  onChange={handleEditChange}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md="6">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  name="tanggal"
                  value={editData.tanggal}
                  onChange={handleEditChange}
                  required
                />
              </Col>
            </Row>

            <FormGroup className="mt-3">
              <Label>Detail Laporan</Label>
              <Input
                type="textarea"
                name="detail_laporan"
                rows="15"
                value={editData.detail_laporan}
                onChange={handleEditChange}
                required 
              />
            </FormGroup>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button color="secondary" onClick={() => setEditModalOpen(false)}>
                Batal
              </Button>
              <Button color="success" type="submit">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default LaporanList;
