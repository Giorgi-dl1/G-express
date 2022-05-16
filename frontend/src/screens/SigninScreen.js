import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
function SigninScreen() {
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";
  return (
    <div className="container signin">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1>Sign In</h1>
      <form action="/">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Sign In</button>
      </form>
      <p>
        New customer?{" "}
        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
      </p>
    </div>
  );
}

export default SigninScreen;
