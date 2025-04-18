import { Link } from "react-router-dom";
export default function Login() {
    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-logo">
                    <a href="/"><b>Admin</b>LTE</a>
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form>
                        <div className="text-danger"></div>
                        <div className="form-group has-feedback">
                            <label className="form-label my-3">Tên đăng nhập<sup>*</sup></label>
                            <input type="text" className="form-control" placeholder="Tên đăng nhập" />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <label className="form-label my-3">Mật khẩu<sup>*</sup></label>
                            <input type="password" className="form-control" placeholder="Password" />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="row">
                            <div className="col-xs-8">
                                <div className="checkbox icheck">
                                    <label>
                                        <input type="checkbox" /> Remember Me
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">Đăng nhập</button>
                            </div>
                        </div>
                    </form>

                    <div className="social-auth-links text-center">
                        <p>- OR -</p>
                        <a href="#" className="btn btn-block btn-social btn-facebook btn-flat">
                            <i className="fa fa-facebook"></i> Sign in using Facebook
                        </a>
                        <a href="#" className="btn btn-block btn-social btn-google-plus btn-flat">
                            <i className="fa fa-google-plus"></i> Sign in using Google+
                        </a>
                    </div>

                    <a href="#">I forgot my password</a>
                    <br />
                    <Link to="/register" className="text-center">Register a new membership</Link>

                </div>
            </div>
        </div>
    );
}
