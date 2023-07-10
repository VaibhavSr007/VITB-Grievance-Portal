
export async function getAccessToken() {
    try {
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
            'Content-type': 'application/json; charset=UTF-8',
        }
        const response = await fetch("http://localhost:3000/accesstoken", { method: 'GET', headers });
        const data = await response.json();
        if (data && data.message === "Unauthorised Access"){
            localStorage.clear();
            return false;
        }
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("accessToken", data.accessToken);
        const values = { name: data.name, regNo: data.regNo || "", empNo: data.empNo || "", isSuperUser: data.isSuperUser || false };
        return values;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
}