import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  listarUsuarios,
  crearUsuario,
  type UsuarioAPI,
} from "./services/api";

type Page =
  | "dashboard"
  | "register"
  | "history"
  | "justifications"
  | "reports"
  | "users";

type Role = "Estudiante" | "Profesor" | "Administrador";

type User = {
  name: string;
  initials: string;
  id: string;
  role: Role;
  status: "Activo" | "Inactivo";
  email: string;
};


type AttendanceRow = {
  date: string;
  person: string;
  initials: string;
  entry: string;
  exit: string;
  status: "Presente" | "Atraso" | "Falta";
};

function convertirUsuarios(datos: UsuarioAPI[]): User[] {
  return datos.map((usuario) => ({
    name: usuario.nombre,
    initials: usuario.iniciales,
    id: usuario.identificacion,
    role: usuario.rol,
    status: usuario.estado,
    email: usuario.correo,
  }));
}
type IconName =
  | "logo"
  | "dashboard"
  | "clock"
  | "calendar"
  | "document"
  | "chart"
  | "users"
  | "logout"
  | "search"
  | "bell"
  | "chevron"
  | "download"
  | "plus"
  | "edit"
  | "ban"
  | "check"
  | "x"
  | "upload"
  | "qr"
  | "menu"
  | "arrow";

const icons: Record<IconName, ReactNode> = {
  logo: <><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="M8 12h8M12 8v8"/></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  document: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  users: <><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  ban: <><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  x: <path d="m6 6 12 12M18 6 6 18"/>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></>,
  qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M15 14h2v3h4v4h-7v-4h1z"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  arrow: <path d="m9 18 6-6-6-6"/>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const navItems: { id: Page; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "register", label: "Registrar Asistencia", icon: "clock" },
  { id: "history", label: "Historial", icon: "calendar" },
  { id: "justifications", label: "Justificaciones", icon: "document" },
  { id: "reports", label: "Reportes", icon: "chart" },
  { id: "users", label: "Usuarios", icon: "users" },
];

const initialAttendance: AttendanceRow[] = [
  { date: "20 May, 2025", person: "María González", initials: "MG", entry: "07:54", exit: "—", status: "Presente" },
  { date: "20 May, 2025", person: "Carlos Mendoza", initials: "CM", entry: "08:12", exit: "—", status: "Atraso" },
  { date: "20 May, 2025", person: "Ana Rodríguez", initials: "AR", entry: "07:48", exit: "—", status: "Presente" },
  { date: "20 May, 2025", person: "Diego Herrera", initials: "DH", entry: "—", exit: "—", status: "Falta" },
  { date: "19 May, 2025", person: "Sofía Castillo", initials: "SC", entry: "07:59", exit: "17:04", status: "Presente" },
];

const initialUsers: User[] = [
  { name: "María González", initials: "MG", id: "1720345678", role: "Profesor", status: "Activo", email: "maria@asistepro.edu" },
  { name: "Carlos Mendoza", initials: "CM", id: "1719854321", role: "Profesor", status: "Activo", email: "carlos@asistepro.edu" },
  { name: "Ana Rodríguez", initials: "AR", id: "1721567890", role: "Estudiante", status: "Activo", email: "ana@asistepro.edu" },
  { name: "Diego Herrera", initials: "DH", id: "1718123456", role: "Estudiante", status: "Inactivo", email: "diego@asistepro.edu" },
  { name: "Sofía Castillo", initials: "SC", id: "1722987456", role: "Estudiante", status: "Activo", email: "sofia@asistepro.edu" },
  { name: "Mateo Silva", initials: "MS", id: "1723456789", role: "Estudiante", status: "Activo", email: "mateo@asistepro.edu" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo-lockup ${inverse ? "inverse" : ""}`}>
      <span className="logo-mark"><Icon name="logo" size={25} /></span>
      <span><strong>AsistePro</strong><small>Control de asistencia</small></span>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  const type = String(children).toLowerCase();
  return <span className={`badge ${type}`}>{children}</span>;
}

function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="page-title">
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      {action}
    </div>
  );
}

function DataTable({ rows, compact = false }: { rows: AttendanceRow[]; compact?: boolean }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Fecha</th><th>Usuario</th><th>Hora de entrada</th><th>Hora de salida</th><th>Estado</th></tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.person}-${index}`}>
              <td>{row.date}</td>
              <td><div className="person"><span className="avatar small">{row.initials}</span><strong>{row.person}</strong></div></td>
              <td>{row.entry}</td><td>{row.exit}</td><td><Badge>{row.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && <div className="pagination"><span>Mostrando 1–5 de 128 registros</span><div><button>Anterior</button><button className="active">1</button><button>2</button><button>3</button><button>Siguiente</button></div></div>}
    </div>
  );
}

function Dashboard({ goTo, attendance, name }: { goTo: (page: Page) => void; attendance: AttendanceRow[]; name: string }) {
  const bars = [72, 86, 64, 91, 79, 38, 24];
  return (
    <>
      <PageTitle title={`Buenos días, ${name.split(" ")[0]}`} subtitle="Aquí tienes el resumen actualizado de asistencia." />
      <div className="stats-grid">
        {[
          { label: "Asistencias hoy", value: "124", note: "+8% vs. ayer", icon: "users" as IconName, tone: "blue" },
          { label: "Atrasos", value: "8", note: "6% del total", icon: "clock" as IconName, tone: "amber" },
          { label: "Faltas", value: "5", note: "4% del total", icon: "x" as IconName, tone: "red" },
          { label: "Justificaciones", value: "3", note: "Pendientes de revisión", icon: "document" as IconName, tone: "violet" },
        ].map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.note}</small></div>
            <span className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} /></span>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="card-head"><div><h2>Asistencia semanal</h2><p>Registros de los últimos 7 días</p></div><select aria-label="Periodo"><option>Esta semana</option></select></div>
          <div className="chart-area">
            <div className="y-labels"><span>150</span><span>100</span><span>50</span><span>0</span></div>
            <div className="bars">
              {bars.map((height, i) => <div className="bar-item" key={i}><div className="bar-track"><div className="bar-fill" style={{ height: `${height}%` }}><span>{Math.round(height * 1.45)}</span></div></div><small>{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i]}</small></div>)}
            </div>
          </div>
          <div className="chart-legend"><span><i /> Presente</span><span><i /> Meta diaria</span></div>
        </section>
        <section className="card activity-card">
          <div className="card-head"><div><h2>Actividad reciente</h2><p>Últimos registros</p></div></div>
          {attendance.slice(0, 4).map((item, i) => (
            <div className="activity" key={item.person}>
              <span className="avatar small">{item.initials}</span>
              <div><strong>{item.person}</strong><small>{item.status === "Falta" ? "Ausencia registrada" : `Entrada registrada a las ${item.entry}`}</small></div>
              <time>{i * 8 + 2} min</time>
            </div>
          ))}
        </section>
      </div>
      <section className="card">
        <div className="card-head table-heading"><div><h2>Últimas asistencias</h2><p>Registros más recientes del sistema</p></div><button className="text-button" onClick={() => goTo("history")}>Ver historial <Icon name="arrow" size={16} /></button></div>
        <DataTable rows={attendance.slice(0, 4)} compact />
      </section>
    </>
  );
}

function Register({
  users,
  onRegister,
}: {
  users: User[];
  onRegister: (user: User, type: "entry" | "exit") => void;
}) {
  const activeUsers = users.filter((user) => user.status === "Activo");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [success, setSuccess] = useState("");
  const matches = query.trim()
    ? activeUsers.filter((user) =>
        `${user.name} ${user.id} ${user.role}`.toLowerCase().includes(query.toLowerCase()),
      )
    : activeUsers;

  const register = (type: "entry" | "exit") => {
    if (!selected) {
      setSuccess("Selecciona primero un estudiante o profesor.");
      return;
    }
    onRegister(selected, type);
    setSuccess(
      `${type === "entry" ? "Entrada" : "Salida"} de ${selected.name} registrada correctamente.`,
    );
    window.setTimeout(() => setSuccess(""), 3500);
  };

  const chooseUser = (user: User) => {
    setSelected(user);
    setQuery(user.name);
    setSuccess("");
  };

  return (
    <>
      <PageTitle title="Registrar asistencia" subtitle="Registra la entrada o salida de un colaborador." />
      {success && <div className={`success-banner ${!selected ? "warning" : ""}`}><span><Icon name={selected ? "check" : "bell"} /></span><div><strong>{selected ? "Asistencia registrada" : "Falta seleccionar una persona"}</strong><p>{success}</p></div><button onClick={() => setSuccess("")} aria-label="Cerrar"><Icon name="x" size={18} /></button></div>}
      <div className="register-grid">
        <section className="card register-main">
          <div className="step-title"><span>1</span><div><h2>Buscar colaborador</h2><p>Ingresa el nombre o número de cédula.</p></div></div>
          <div className="user-picker">
            <label className="search-large"><Icon name="search" /><input placeholder="Buscar estudiante o profesor..." value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} /></label>
            {!selected && <div className="search-results">
              {matches.slice(0, 5).map((user) => <button key={user.id} onClick={() => chooseUser(user)}><span className="avatar small">{user.initials}</span><span><strong>{user.name}</strong><small>{user.role} · C.I. {user.id}</small></span><Icon name="chevron" size={16} /></button>)}
              {matches.length === 0 && <p>No se encontraron usuarios activos.</p>}
            </div>}
          </div>
          {selected ? <div className="selected-user"><span className="avatar">{selected.initials}</span><div><strong>{selected.name}</strong><small>{selected.role} · C.I. {selected.id}</small></div><Badge>{selected.status}</Badge><button className="change-user" onClick={() => { setSelected(null); setQuery(""); }}>Cambiar</button></div> : <div className="selection-hint"><Icon name="users" /><span>Selecciona una persona de la lista para continuar</span></div>}
          <div className="divider" />
          <div className="step-title"><span>2</span><div><h2>Tipo de registro</h2><p>Selecciona la acción que deseas registrar.</p></div></div>
          <div className="action-buttons">
            <button className="entry-button" onClick={() => register("entry")}><span><Icon name="arrow" size={27} /></span><div><strong>Registrar Entrada</strong><small>Marca el inicio de la jornada</small></div></button>
            <button className="exit-button" onClick={() => register("exit")}><span><Icon name="logout" size={27} /></span><div><strong>Registrar Salida</strong><small>Finalizar jornada</small></div></button>
          </div>
        </section>
        <section className="card qr-card">
          <span className="eyebrow">MÉTODO ALTERNATIVO</span><h2>Escanear código QR</h2><p>Coloca el código QR del colaborador dentro del recuadro.</p>
          <div className="qr-frame"><i /><i /><i /><i /><Icon name="qr" size={84} /></div>
          <button className="secondary-button"><Icon name="qr" /> Activar cámara</button>
          <small className="helper">La cámara solo se utilizará para leer el código.</small>
        </section>
      </div>
    </>
  );
}

function Filters({ report = false }: { report?: boolean }) {
  return (
    <div className="filters">
      {report ? <><label><span>Desde</span><input type="date" defaultValue="2025-05-01" /></label><label><span>Hasta</span><input type="date" defaultValue="2025-05-20" /></label><label><span>Tipo de reporte</span><select><option>Resumen de asistencia</option><option>Atrasos</option><option>Ausencias</option></select></label></> :
      <><label><span>Desde</span><input type="date" defaultValue="2025-05-01" /></label><label><span>Hasta</span><input type="date" defaultValue="2025-05-20" /></label><label className="grow"><span>Usuario</span><div className="input-icon"><Icon name="search" size={17} /><input placeholder="Buscar usuario" /></div></label><label><span>Estado</span><select><option>Todos</option><option>Presente</option><option>Atraso</option><option>Falta</option></select></label></>}
      <button className="primary-button">Aplicar filtros</button>
    </div>
  );
}

function History({ attendance }: { attendance: AttendanceRow[] }) {
  return (
    <>
      <PageTitle title="Historial de asistencia" subtitle="Consulta y administra todos los registros de asistencia." action={<div className="button-row"><button className="secondary-button"><Icon name="download" /> Excel</button><button className="primary-button"><Icon name="download" /> Exportar PDF</button></div>} />
      <section className="card filter-card"><Filters /></section>
      <section className="card"><div className="card-head table-heading"><div><h2>Registros de asistencia</h2><p>{attendance.length} registros encontrados</p></div></div><DataTable rows={attendance} /></section>
    </>
  );
}

function Justifications() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageTitle title="Justificaciones" subtitle="Gestiona las solicitudes de justificación de ausencias y atrasos." />
      <div className="justification-grid">
        <section className="card form-card">
          <div className="card-head"><div><h2>Nueva justificación</h2><p>Completa la información de la solicitud.</p></div></div>
          {sent && <div className="inline-success"><Icon name="check" /> Solicitud enviada para revisión.</div>}
          <label><span>Fecha de la incidencia</span><input type="date" /></label>
          <label><span>Motivo</span><textarea rows={5} placeholder="Describe brevemente el motivo de la ausencia o atraso..." /></label>
          <label><span>Archivo adjunto</span><div className="upload-box"><Icon name="upload" /><strong>Haz clic para adjuntar un archivo</strong><small>PDF, JPG o PNG · Máximo 5 MB</small><input type="file" /></div></label>
          <button className="primary-button full" onClick={() => setSent(true)}>Enviar solicitud</button>
        </section>
        <section className="card">
          <div className="card-head"><div><h2>Solicitudes recientes</h2><p>Revisa y gestiona las solicitudes pendientes.</p></div><select><option>Todas</option><option>Pendientes</option></select></div>
          {[
            { name: "Carlos Mendoza", reason: "Cita médica", date: "20 May, 2025", status: "Pendiente", initials: "CM" },
            { name: "Sofía Castillo", reason: "Calamidad doméstica", date: "18 May, 2025", status: "Aprobada", initials: "SC" },
            { name: "Diego Herrera", reason: "Problema de transporte", date: "16 May, 2025", status: "Rechazada", initials: "DH" },
          ].map((item) => <div className="request" key={item.name}><span className="avatar small">{item.initials}</span><div><strong>{item.name}</strong><small>{item.reason} · {item.date}</small></div><Badge>{item.status}</Badge>{item.status === "Pendiente" && <div className="request-actions"><button className="approve" title="Aprobar"><Icon name="check" size={16} /></button><button className="reject" title="Rechazar"><Icon name="x" size={16} /></button></div>}</div>)}
        </section>
      </div>
    </>
  );
}

function Reports() {
  return (
    <>
      <PageTitle title="Reportes" subtitle="Genera y descarga reportes detallados de asistencia." />
      <section className="card filter-card"><div className="card-head"><div><h2>Configurar reporte</h2><p>Selecciona los parámetros para generar la vista previa.</p></div></div><Filters report /></section>
      <section className="card report-preview">
        <div className="card-head table-heading"><div><span className="eyebrow">VISTA PREVIA</span><h2>Resumen de asistencia</h2><p>Del 1 al 20 de mayo de 2025</p></div><div className="button-row"><button className="secondary-button"><Icon name="download" /> Excel</button><button className="primary-button"><Icon name="download" /> Descargar PDF</button></div></div>
        <div className="report-kpis"><div><span>Días laborables</span><strong>14</strong></div><div><span>Asistencia promedio</span><strong>92.4%</strong></div><div><span>Total atrasos</span><strong>36</strong></div><div><span>Total faltas</span><strong>18</strong></div></div>
        <div className="report-visual"><div className="donut"><div><strong>92%</strong><span>Asistencia</span></div></div><div className="report-breakdown"><h3>Distribución general</h3>{[["Presentes", "1,724", "blue"], ["Atrasos", "36", "amber"], ["Faltas", "18", "red"], ["Justificadas", "12", "violet"]].map((v) => <div key={v[0]}><span><i className={v[2]} />{v[0]}</span><strong>{v[1]}</strong></div>)}</div></div>
      </section>
    </>
  );
}

const emptyUser: User = {
  name: "",
  initials: "",
  id: "",
  role: "Estudiante",
  status: "Activo",
  email: "",
};

function Users({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<User>(emptyUser);
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyUser);
    setPassword("");
    setModal(true);
  };

  const openEdit = (user: User) => {
    setEditingId(user.id);
    setForm(user);
    setModal(true);
  };

  const saveUser = async () => {
    if (!form.name.trim() || !form.id.trim() || !form.email.trim()) {
      return;
    }

    if (editingId) {
      const updated = {
        ...form,
        initials: getInitials(form.name),
      };

      setUsers((current) =>
        current.map((user) =>
          user.id === editingId ? updated : user,
        ),
      );

      setModal(false);
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await crearUsuario({
        cedula: form.id.trim(),
        nombre: form.name.trim(),
        correo: form.email.trim(),
        contrasena: password,
        rol: form.role,
      });

      const datos = await listarUsuarios();
      setUsers(convertirUsuarios(datos));

      setPassword("");
      setModal(false);
      alert("Usuario guardado correctamente en MySQL.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el usuario.",
      );
    }
  };

  const toggleUser = (id: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Activo" ? "Inactivo" : "Activo" }
          : user,
      ),
    );
  };

  const visibleUsers = users.filter((user) =>
    `${user.name} ${user.id} ${user.role}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageTitle title="Gestión de usuarios" subtitle="Administra estudiantes, profesores y sus permisos de acceso." action={<button className="primary-button" onClick={openCreate}><Icon name="plus" /> Agregar usuario</button>} />
      <section className="card">
        <div className="user-tools"><label className="search-large"><Icon name="search" /><input placeholder="Buscar por nombre, cédula o rol..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><select><option>Todos los roles</option><option>Estudiante</option><option>Profesor</option><option>Administrador</option></select><select><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select></div>
        <div className="table-wrap"><table><thead><tr><th>Usuario</th><th>Cédula</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id}><td><div className="person"><span className="avatar small">{user.initials}</span><div className="user-cell"><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td>{user.id}</td><td>{user.role}</td><td><Badge>{user.status}</Badge></td><td><div className="icon-actions"><button title="Editar" onClick={() => openEdit(user)}><Icon name="edit" size={17} /></button><button title={user.status === "Activo" ? "Desactivar" : "Activar"} onClick={() => toggleUser(user.id)}><Icon name={user.status === "Activo" ? "ban" : "check"} size={17} /></button></div></td></tr>)}</tbody></table></div>
      </section>
      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(false)}><section className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><h2>{editingId ? "Editar usuario" : "Agregar usuario"}</h2><p>Los cambios se reflejarán inmediatamente en el sistema.</p></div><button onClick={() => setModal(false)}><Icon name="x" /></button></div><div className="form-grid"><label><span>Nombre completo</span><input placeholder="Ej. Andrea López" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label><span>Número de cédula</span><input placeholder="10 dígitos" value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} /></label><label><span>Correo electrónico</span><input type="email" placeholder="nombre@institucion.edu" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>{!editingId && (<label><span>Contraseña</span><input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>)}<label><span>Rol</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}><option>Estudiante</option><option>Profesor</option><option>Administrador</option></select></label><label><span>Estado</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as User["status"] })}><option>Activo</option><option>Inactivo</option></select></label></div><div className="modal-actions"><button className="secondary-button" onClick={() => setModal(false)}>Cancelar</button><button className="primary-button" onClick={saveUser} disabled={!form.name.trim() || !form.id.trim() || !form.email.trim()}>{editingId ? "Guardar cambios" : "Crear usuario"}</button></div></section></div>}
    </>
  );
}

function Login({ onLogin }: { onLogin: (role: Exclude<Role, "Administrador">) => void }) {
  const [role, setRole] = useState<Exclude<Role, "Administrador">>("Estudiante");
  const submit = (event: FormEvent) => { event.preventDefault(); onLogin(role); };
  return (
    <main className="login-page">
      <div className="login-decoration one" /><div className="login-decoration two" />
      <section className="login-panel">
        <Logo />
        <div className="login-heading"><h1>Bienvenido de nuevo</h1><p>Ingresa tus credenciales para acceder al sistema.</p></div>
        <form onSubmit={submit}>
          <fieldset className="role-selector">
            <legend>Ingresar como</legend>
            <button type="button" className={role === "Estudiante" ? "active" : ""} onClick={() => setRole("Estudiante")}><span><Icon name="users" /></span><div><strong>Estudiante</strong><small>Consulta y registra tu asistencia</small></div><i /></button>
            <button type="button" className={role === "Profesor" ? "active" : ""} onClick={() => setRole("Profesor")}><span><Icon name="document" /></span><div><strong>Profesor</strong><small>Gestiona la asistencia del curso</small></div><i /></button>
          </fieldset>
          <label><span>Correo electrónico</span><input key={role} type="email" placeholder="nombre@institucion.edu" defaultValue={role === "Estudiante" ? "ana@asistepro.edu" : "maria@asistepro.edu"} required /></label>
          <label><span>Contraseña</span><input type="password" placeholder="Ingresa tu contraseña" defaultValue="asistepro" required /></label>
          <div className="login-options"><label><input type="checkbox" /> Recordarme</label><button type="button">¿Olvidaste tu contraseña?</button></div>
          <button className="primary-button login-button">Iniciar sesión como {role} <Icon name="arrow" /></button>
        </form>
        <div className="login-help"><Icon name="logo" size={17} /><span>Acceso seguro para personal autorizado</span></div>
      </section>
      <aside className="login-visual"><div className="visual-content"><span className="visual-icon"><Icon name="chart" size={30} /></span><h2>Decisiones informadas,<br />equipos más puntuales.</h2><p>Centraliza el control de asistencia de tu institución en un solo lugar.</p><div className="visual-stats"><div><strong>98.2%</strong><span>Precisión</span></div><div><strong>+240</strong><span>Usuarios</span></div><div><strong>24/7</strong><span>Disponible</span></div></div></div></aside>
    </main>
  );
}

function AppShell({
  onLogout,
  role,
}: {
  onLogout: () => void;
  role: Exclude<Role, "Administrador">;
}) {
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [attendance, setAttendance] = useState<AttendanceRow[]>(initialAttendance);

  useEffect(() => {
    let activo = true;

    listarUsuarios()
      .then((datos: UsuarioAPI[]) => {
        if (activo) {
          setUsers(convertirUsuarios(datos));
        }
      })
      .catch((error: unknown) => {
        console.error("Error al cargar usuarios:", error);
      });

    return () => {
      activo = false;
    };
  }, []);

  const navigate = (target: Page) => { setPage(target); setMobileOpen(false); };
  const profile = role === "Estudiante"
    ? { name: "Ana Rodríguez", initials: "AR" }
    : { name: "María González", initials: "MG" };
  const visibleNav = role === "Estudiante"
    ? navItems.filter((item) => !["users", "reports"].includes(item.id))
    : navItems;

  const registerAttendance = (user: User, type: "entry" | "exit") => {
    const now = new Date();
    const time = now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false });
    const date = now.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
    setAttendance((current) => {
      if (type === "exit") {
        const pendingIndex = current.findIndex((row) => row.person === user.name && row.exit === "—");
        if (pendingIndex >= 0) {
          return current.map((row, index) => index === pendingIndex ? { ...row, exit: time } : row);
        }
      }
      return [{
        date,
        person: user.name,
        initials: user.initials,
        entry: type === "entry" ? time : "—",
        exit: type === "exit" ? time : "—",
        status: type === "entry" && now.getHours() >= 8 ? "Atraso" : "Presente",
      }, ...current];
    });
  };

  const pages: Record<Page, ReactNode> = {
    dashboard: <Dashboard goTo={navigate} attendance={attendance} name={profile.name} />,
    register: <Register users={role === "Estudiante" ? users.filter((user) => user.name === profile.name) : users} onRegister={registerAttendance} />,
    history: <History attendance={role === "Estudiante" ? attendance.filter((row) => row.person === profile.name) : attendance} />,
    justifications: <Justifications />,
    reports: <Reports />,
    users: <Users users={users} setUsers={setUsers} />,
  };
  const title = navItems.find((item) => item.id === page)?.label;
  return (
    <div className="app-shell">
      {mobileOpen && <div className="nav-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo"><Logo inverse /></div>
        <nav>{visibleNav.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{page === item.id && <Icon name="chevron" size={16} />}</button>)}</nav>
        <div className="sidebar-footer"><div className="mini-profile"><span className="avatar">{profile.initials}</span><div><strong>{profile.name}</strong><small>{role}</small></div></div><button onClick={onLogout}><Icon name="logout" /><span>Cerrar sesión</span></button></div>
      </aside>
      <div className="workspace">
        <header><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button><div className="breadcrumb"><span>AsistePro</span><Icon name="chevron" size={14} /><strong>{title}</strong></div><div className="header-actions"><button className="notification"><Icon name="bell" /><i /></button><div className="header-profile"><span className="avatar small">{profile.initials}</span><div><strong>{profile.name}</strong><small>{role}</small></div></div></div></header>
        <main className="content">{pages[page]}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Exclude<Role, "Administrador"> | null>(null);
  return role ? <AppShell role={role} onLogout={() => setRole(null)} /> : <Login onLogin={setRole} />;
}
