function convertJsonToVault() {
    const input = document.getElementById('inputJson').value;
    let json;
    try {
        json = JSON.parse(input);
    } catch (e) {
        alert('Invalid JSON');
        return;
    }

    const result = {};
    function flattenObject(obj, parentKey = '') {
        Object.keys(obj).sort().forEach(key => {
            const value = obj[key];
            const newKey = parentKey ? `${parentKey}__${key}` : key;

            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                flattenObject(value, newKey);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        flattenObject(item, `${newKey}__${index}`);
                    } else {
                        result[`${newKey}__${index}`] = `"${item}"`;
                    }
                });
            } else {
                result[newKey] = typeof value === 'string' ? `"${value}"` : `${value}`;
            }
        });
    }

    flattenObject(json);
    result[''] = ''; // Menambahkan atribut terakhir "": ""

    document.getElementById('outputJson').value = JSON.stringify(result, null, 2);
    showToast();
}

function convertVaultToJson() {
    const input = document.getElementById('outputJson').value; // Mengambil input dari textarea sebelah kanan
    let vaultJson;
    try {
        vaultJson = JSON.parse(input);
    } catch (e) {
        alert('Invalid JSON Vault');
        return;
    }

    const result = {};
    Object.keys(vaultJson).sort().forEach(key => {
        if (key === '') return; // Abaikan atribut terakhir "": ""
        const keys = key.split('__');
        keys.reduce((acc, cur, idx) => {
            if (idx === keys.length - 1) {
                let value = vaultJson[key];
                if (value === '"true"') value = true;
                else if (value === '"false"') value = false;
                else if (!isNaN(value) && value.trim() !== '') value = parseFloat(value);
                else value = value.replace(/^"|"$/g, '');
                acc[cur] = value;
            } else {
                acc[cur] = acc[cur] || {};
            }
            return acc[cur];
        }, result);
    });

    document.getElementById('inputJson').value = JSON.stringify(result, null, 2); // Menempatkan hasil di textarea sebelah kiri
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.className = 'toast show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}
