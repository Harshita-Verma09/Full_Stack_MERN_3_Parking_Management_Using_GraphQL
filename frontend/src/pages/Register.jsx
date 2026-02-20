import "../styles/auth.css";

export default function Register({ setPage }) {

  const registerUser = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;

    await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `
          mutation Register($username:String!, $email:String!) {
            register(username:$username, email:$email) {
              message
            }
          }
        `,
        variables: { username, email }
      })
    });

    setPage("login");
  };

  return (
    <div className="auth-page">   {/* ADD THIS */}
      <div className="container">
        <h2>Create Account</h2>

        <form onSubmit={registerUser}>
          <div className="input-group">
            <input type="text" name="username" required />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input type="email" name="email" required />
            <label>Email</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="link" onClick={() => setPage("login")}>
          Already registered? Login
        </div>
      </div>
    </div>
  );
}
