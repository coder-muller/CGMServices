const BASE_URL = 'http://localhost:4567'

export function parseDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return null;
    const [_, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day) {
        return date;
    }
    return null;
}

export function isValidDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;
    const [_, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

export function convertIsoToDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export async function carregarSelect(rota, selectHtml, value, campoTexto) {
    const chave = localStorage.getItem('chaveConectada');
    const response = await sendGet(rota + '/' + chave);
    if (response) {
        const select = document.getElementById(selectHtml);
        select.innerHTML = '';
        response.forEach(data => {         
            const option = document.createElement('option');
            option.value = data[value];
            option.textContent = data[campoTexto];
            select.appendChild(option);
        });
    } else {
        console.error('Erro na conexão com o banco de dados!');
    }
}


export async function sendGet(rota) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        if (responseData.ok) {
            const data = await responseData.json()
            return data
        } else {
            console.error('Erro no retorno do servidor!')
        }
    } catch (error) {
        console.error('Erro na conexão com o servidor!', error)
    }
}

export async function sendPost(rota, body) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
        if (responseData.ok) {
            const data = await responseData.json()
            return data
        } else {
            console.error('Erro no retorno do servidor!')
        }
    } catch (error) {
        console.error('Erro na conexão com o servidor!', error)
    }
}

export async function sendPut(rota, body) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(body)
        })
        if (responseData.ok) {
            const data = await responseData.json()
            return data
        } else {
            console.error('Erro no retorno do servidor!')
        }
    } catch (error) {
        console.error('Erro na conexão com o servidor!', error)
    }
}

export async function sendDelete(rota, body) {
    try {
        const responseData = await fetch(BASE_URL + rota, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify(body)
        })
        if (responseData.ok) {
            const data = await responseData.json()
            return data
        } else {
            console.error('Erro no retorno do servidor!')
        }
    } catch (error) {
        console.error('Erro na conexão com o servidor!', error)
    }
}