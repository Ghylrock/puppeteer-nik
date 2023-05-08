
function showForm(){
    $('#form').show();
    $('#resultArea').hide();
    $('.success').show();
}

function getData(nik){
    $('#loading').show();
    $('#form').hide();
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nik: nik})
    };
    
    fetch('/cekdpt', request)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed!');
            }
        })
        .then(data => {
            let html;
            if(data[1].nama){

                const tps = String(data[2].TPS).split(',');
                const codeTps = tps[0].split(':')[1];
                const kecamatan = tps[1];
                const kelurahan = tps[2];


                html = `
                <p class="mb-0">NIK : <span class="text-warning">${data[0].NIK}</span></p>
                <p class="mb-0">Nama : <span class="text-warning">${data[1].nama}</span></p>
                <p class="mb-0">Kecamatan : <span class="text-warning">${kecamatan}</span></p>
                <p class="mb-0">Kelurahan : <span class="text-warning">${kelurahan}</span></p>
                <p class="mb-0">Kode TPS : <span class="text-warning">${codeTps}</span></p>`;

               
                $('#resultArea').show();
                $('.success').show();
                $('#loading').hide();
                
                document.getElementById('hasil-judul').innerHTML = '<i class="fas fa-check"></i> Data valid';
            }else{
                html = `
                <p class="mb-0">NIK : <span class="text-warning">${data[0].NIK}</span></p>
                <p class="mb-0">Keterangan : <span class="text-warning">${data[1].Keterangan}</span></p>`;

                $('#resultArea').show();
                $('.success').hide();
                $('#loading').hide();

                document.getElementById('hasil-judul').innerHTML = '<i class="fas fa-triangle-exclamation"></i> Data tidak valid';
            }
            document.getElementById('details').innerHTML = html;
            
        })
        .catch(error => {
            console.error('Error:', error);
    });
}


function submit(){
    getData(document.getElementById('form-nik').value)
}