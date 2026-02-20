
import "../styles/auth.css";

export default function VerifyOTP({ email, setPage }) {

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;

    const res = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
          mutation VerifyOTP($email:String!, $otp:String!) {
            verifyOTP(email:$email, otp:$otp) {
              message
              token
            }
          }
        `,
        variables: { email, otp }
      })
    });

    const data = await res.json();

    if (data.errors) {
      alert(data.errors[0].message);
      return;
    }

    //  TOKEN STORE HERE (MOST IMPORTANT)
    const token = data.data.verifyOTP.token;
    sessionStorage.setItem("token", token);


    setPage("dashboard");
  };

  return (
    <div className="auth-page">
      <div className="container">
        <h2>Verify OTP</h2>

        <form onSubmit={verifyOtp}>
          <div className="input-group">
            <input type="text" name="otp" required />
            <label>Enter OTP</label>
          </div>

          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}
