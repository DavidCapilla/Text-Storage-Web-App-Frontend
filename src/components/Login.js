const Login = () => {
    return (
        <form className='login-form'>
            <h1>Log in</h1>
            <div className='form-control'>
                <label> Username: </label>
                <input type="text" name="username" />
            </div>
            <div className='form-control'>
                <label> Password:</label>
                <input type="password" name="password" />
            </div>
            <input type="submit" value="Log in" className='btn' />
        </form>
    )
}

export default Login