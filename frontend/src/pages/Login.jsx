
import "../styles/auth.css";

export default function Login({ setPage, setEmail }) {

    const loginUser = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;

        const res = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                  mutation Login($email:String!) {
                    login(email:$email) {
                      message
                    }
                  }
                `,
                variables: { email }
            })
        });

        const data = await res.json();

        if (data.errors) {
            alert(data.errors[0].message);
            return;
        }

        setEmail(email);
        setPage("otp");
    };

    return (
        <div className="auth-page">
            <div className="container">
                <h2>Welcome Back</h2>

                <form onSubmit={loginUser}>
                    <div className="input-group">
                        <input type="email" name="email" required />
                        <label>Email Address</label>
                    </div>

                    <button type="submit">Send OTP</button>
                </form>

                <div className="link" onClick={() => setPage("register")}>
                    New here? Create an account
                </div>
            </div>
        </div>
    );
}
