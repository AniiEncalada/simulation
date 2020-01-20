$().ready(function () {
    $('#form').submit(function (e) {
        e.preventDefault();
        var dias = parseInt($('#dias').val().trim());
        var tinas = parseInt($('#tinas').val().trim());
        var pesoLimite = parseInt($('#limite').val().trim());
        var extra = parseInt($('#extra').val().trim());
        var camion = parseInt($('#camion').val().trim());
        var tabla = $('#table');
        var resultado = $('#resultado');
        camionTransportador(dias, tinas, pesoLimite, extra, camion, tabla, resultado);
    });
});

function camionTransportador(dias, tinas, pesoLimite, extra, camion, tabla, resultado) {
    var tbody = tabla.find('tbody');
    var html = ``;
    var acumulado = 0;
    var probabilidad = 0;

    for (let i = 0; i < dias; i++) {
        html += `<tr><td>${i + 1}</td>`;
        var pesoA = 0;
        for (let j = 0; j < tinas; j++) {
            html += `<td>${j + 1}</td>`;
            var r = generarAleatorio();
            html += `<td>${r}</td>`;
            var peso = 0;
            if (r < 0.5) {
                peso = Math.round(190 + Math.sqrt(800 * r));
            } else {
                peso = Math.round(230 - Math.sqrt((1 - r) * 800));
            }
            pesoA += peso;
            html += `<td>${peso} Kg</td><td>${pesoA} Kg</td>`;
            if (j == (tinas - 1)) {
                if (pesoA > pesoLimite) {
                    // Si excede
                    html += `<td>Si</td></tr>`;
                    acumulado += extra;
                    probabilidad++;
                } else {
                    html += `<td>No</td></tr>`;
                }
            } else {
                html += `<td></td></tr><tr><td></td>`;
            }
        }
    }
    tbody.html(html);
    // Promedio anual acumulado
    var años = dias / 260
    acumulado /= años; //260 Días laborales de un año
    probabilidad /= dias;
    html = `<span>Años empleados: </span><small> ${redondear(años, 2)} año(s)</small><br>`;
    html += `<span>Peso límite del camión: </span><small> ${pesoLimite} Kg</small><br>`;
    html += `<span>Costo promedio actual obtenido: </span><small> $${redondear(acumulado, 2)}</small><br>`;
    html += `<span>Costo promedio del nuevo camión: </span><small> $${camion}</small><br>`;
    html += `<span>Probabilidad Estimada: </span><small> ${redondear(probabilidad * 100, 2)}%</small>`;
    resultado.html(html);
}

function generarAleatorio() {
    return parseFloat(Math.random().toFixed(5));
}


function redondear(number, decimals) {
    var places = Math.pow(10, decimals);
    return Math.round(number * places) / places;
}