/* eslint-disable */

const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'https://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
    } catch (err){

    }


}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});