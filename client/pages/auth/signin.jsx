import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });


  const onSubmit = async (ev) => {
    ev.preventDefault();

    await doRequest();

  };

  return (
    <div className="container">
      <div
        className="card"
        style={{ width: "38rem", margin: "0 auto", marginTop: "50px" }}
      >
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <h1>Sign In</h1>

            {errors?.length > 0 && 
            
            (
              <div className="alert alert-danger">
                <ul className="my-0">
                  {errors.map((err, i) => (
                    <li key={err+i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                required
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                required
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary mt-3">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};
