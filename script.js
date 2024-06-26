function convertJson() {
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
}
