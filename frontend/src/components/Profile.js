export default function Profile({userData, usernameHandler, changeUsername, passwordHandler, changePassword}) {
    return (
        <div className="bg-white p-3 rounded-bottom">
            <h1>Profile</h1>
            <div><span className='fw-bold'>Email: </span>{userData.email}</div>
            <div>
                <label className="fw-bold">Username: </label>
                <input
                    type="text"
                    value={userData.username}
                    onChange={usernameHandler}
                    id="newUsername"
                    name="newUsername"
                    className="form-control mb-3"
                />
                <button className="btn btn-secondary mb-3" onClick={changeUsername}>
                    Change username
                </button>
            </div>
            <div>
                <label className="fw-bold">Password: </label>
                <input
                    type="password"
                    value={userData.password}
                    onChange={passwordHandler}
                    id="newPassword"
                    name="newPassword"
                    className="form-control mb-3"
                />
                <button className="btn btn-secondary mb-2" onClick={() => changePassword}>
                    Change password
                </button>
            </div>
        </div>
    )
}