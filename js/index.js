$().ready(function () {
    $('#form').submit(function (e) {
        e.preventDefault();
        var corridas = parseInt($('#corridas').val().trim());
        var inicial = parseInt($('#inicial').val().trim());
        var apuesta = parseInt($('#apuesta').val().trim());
        var meta = parseInt($('#meta').val().trim());
        var tabla = $('#table');
        volados(corridas, inicial, apuesta, meta, tabla);
    });
});

// Congruencial Mixto
function generarAleatorio(a, c, m, xn) {
    var numero = 0;
    numero = ((a * xn) + c) % m;
    numero /= m;
    return parseFloat(numero.toFixed(5));
}

function volados(corridas, inicial, apuesta, meta, tabla) {
    var tbody = tabla.find('tbody');
    var html = ``;
    for (let i = 1; i <= corridas; i++) {
        var auxInicial = inicial;
        var auxApuesta = apuesta;
        html += `<tr><td>${i}</td>`;
        for (let j = auxInicial; j < meta;) {
            // Generando un Aleatorio
            var semilla = Math.floor(Math.random() * (i * corridas));
            var aleatorio = generarAleatorio(apuesta, inicial, corridas, semilla);

            html += `<td>${auxInicial}</td><td>${auxApuesta}</td><td>${aleatorio}</td>`;
            if (aleatorio < 0.5) {
                // Gana el volado
                auxInicial += auxApuesta;
                html += `<td>Si</td><td>${auxInicial}</td>`;
                auxApuesta = apuesta;
            } else {
                // Pierde el volado
                auxInicial -= auxApuesta;
                html += `<td>No</td><td>${auxInicial}</td>`;
                auxApuesta *= 2;
                if (auxApuesta > auxInicial)
                    // Si la apuesta supera al valor inicial
                    auxApuesta = auxInicial;
            }
            if (auxInicial >= meta) {
                // Llega a la meta
                html += `<td>Si</td></tr>`;
            } else {
                // No llega a la meta
                if (auxInicial > 0) {
                    html += `<td>No</td></tr><tr><td></td>`;
                } else {
                    // Si quiebra pasa a la siguiente corrida
                    html += `<td>Quiebra</td></tr>`;
                    break;
                }
            }
            j = auxInicial;
        }

    }
    tbody.html(html);
}