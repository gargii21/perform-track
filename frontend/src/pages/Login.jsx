import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Target, User, Briefcase, ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: "employee", label: "Employee", icon: <User size={20} /> },
    { value: "manager", label: "Manager", icon: <Briefcase size={20} /> },
    { value: "admin", label: "Admin / HR", icon: <ShieldCheck size={20} /> },
  ];

  const TEST_ACCOUNTS = [
  { email: "employee2@gmail.com", password: "123456", role: "employee", label: "Employee", color: "#1b4fff", bg: "#eef2ff" },
  { email: "manager2@gmail.com",  password: "123456", role: "manager",  label: "Manager",  color: "#0ea5e9", bg: "#e0f2fe" },
  { email: "admin2@gmail.com",    password: "123456", role: "admin",    label: "Admin / HR", color: "#8b5cf6", bg: "#ede9fe" },
];

const fillTestAccount = (account) => {
  setEmail(account.email);
  setPassword(account.password);
  setRole(account.role);
};

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "employee") navigate("/employee-dashboard", { replace: true });
      else if (res.data.user.role === "manager") navigate("/manager-dashboard", { replace: true });
      else if (res.data.user.role === "admin") navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const activeRole = roleOptions.find((r) => r.value === role);

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Brand */}
        <div style={styles.brandRow}>
          <div style={styles.brandLogo}>
            <Target size={20} color="#fff" />
          </div>
          <div style={styles.brandName}>
            Perform<span style={{ color: "#1b4fff" }}>track</span>
          </div>
        </div>

        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to access your workspace</p>

        {/* Role Cards */}
        <div style={styles.roleGrid}>
          {roleOptions.map((r) => (
            <div
              key={r.value}
              onClick={() => setRole(r.value)}
              style={{
                ...styles.roleCard,
                ...(role === r.value ? styles.roleCardActive : {}),
              }}
            >
              <div
                style={{
                  ...styles.roleIcon,
                  ...(role === r.value ? styles.roleIconActive : {}),
                }}
              >
                <span style={{ color: role === r.value ? "#fff" : "#1b4fff" }}>
                  {r.icon}
                </span>
              </div>
              <span
                style={{
                  ...styles.roleLabel,
                  ...(role === r.value ? styles.roleLabelActive : {}),
                }}
              >
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {/* Active Role Badge */}
        <div style={styles.roleBadge}>
          <span style={{ color: "#1b4fff", display: "flex" }}>{activeRole?.icon}</span>
          <span>Signing in as {activeRole?.label}</span>
        </div>

        {/* Form */}
        <form onSubmit={loginUser}>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <Mail size={16} color="#9aaac8" />
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <Lock size={16} color="#9aaac8" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword
                  ? <EyeOff size={16} color="#9aaac8" />
                  : <Eye size={16} color="#9aaac8" />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: "right", marginBottom: "1.2rem" }}>
            <a href="#" style={styles.forgotLink}>Forgot password?</a>
          </div>

          {/* Submit */}
          <button type="submit" style={styles.loginBtn}>
            <LogIn size={16} />
            Login as {activeRole?.label}
          </button>
        </form>
        {/* Quick Test Switch */}
<div style={styles.testBar}>
  <div style={styles.testLabel}>Quick switch (testing only)</div>
  <div style={styles.testBtns}>
    {TEST_ACCOUNTS.map((acc) => (
      <button
        key={acc.role}
        type="button"
        onClick={() => fillTestAccount(acc)}
        style={{
          ...styles.testBtn,
          background: acc.bg,
          color: acc.color,
          border: `1.5px solid ${acc.color}33`,
          outline: role === acc.role ? `2px solid ${acc.color}` : "none",
        }}
      >
        {acc.label}
      </button>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #dce3f5",
    padding: "2rem",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 4px 24px rgba(27,79,255,0.07)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "1.5rem",
  },
  brandLogo: {
    width: "36px",
    height: "36px",
    background: "#1b4fff",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f1f5c",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f1f5c",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7a99",
    marginBottom: "1.5rem",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "1rem",
  },
  roleCard: {
    border: "1.5px solid #dce3f5",
    borderRadius: "12px",
    padding: "14px 8px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
  },
  roleCardActive: {
    border: "1.5px solid #1b4fff",
    background: "#eef2ff",
  },
  roleIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
  },
  roleIconActive: {
    background: "#1b4fff",
  },
  roleLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#3d4f7c",
    textAlign: "center",
  },
  roleLabelActive: {
    color: "#1b4fff",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#eef2ff",
    borderRadius: "20px",
    padding: "4px 12px 4px 8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#1b4fff",
    marginBottom: "1.2rem",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#3d4f7c",
    marginBottom: "5px",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "10px 12px 10px 38px",
    border: "1.5px solid #dce3f5",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f1f5c",
    background: "#fff",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#1b4fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#1b4fff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  testBar: {
  marginTop: "20px",
  paddingTop: "16px",
  borderTop: "1px dashed #dce3f5",
},
testLabel: {
  fontSize: "11px",
  fontWeight: "600",
  color: "#9aaac8",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px",
},
testBtns: {
  display: "flex",
  gap: "8px",
},
testBtn: {
  flex: 1,
  padding: "8px 0",
  borderRadius: "9px",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
  fontFamily: "'Segoe UI', sans-serif",
  transition: "all 0.15s",
},
};

export default Login;