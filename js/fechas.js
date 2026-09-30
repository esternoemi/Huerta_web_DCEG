function formatearFechaNacimiento(valor) {
    const fechaISO = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(valor || ""));

    return fechaISO ? `${fechaISO[3]}/${fechaISO[2]}/${fechaISO[1]}` : String(valor || "");
}

if (typeof flatpickr === "function") {
    const localeFecha = {
        ...flatpickr.l10ns.es,
        monthAriaLabel: "Mes",
        yearAriaLabel: "Año"
    };

    document.querySelectorAll("[data-fecha-nacimiento]").forEach((campo) => {
        flatpickr(campo, {
            locale: localeFecha,
            dateFormat: "d/m/Y",
            allowInput: false,
            disableMobile: true,
            onChange: () => campo.dispatchEvent(new Event("input", { bubbles: true }))
        });
    });
}

function establecerFechaNacimiento(campo, valor) {
    const fechaFormateada = formatearFechaNacimiento(valor);

    if (campo._flatpickr) {
        if (fechaFormateada) {
            campo._flatpickr.setDate(fechaFormateada, false, "d/m/Y");
        } else {
            campo._flatpickr.clear(false);
        }
        return;
    }

    campo.value = fechaFormateada;
}