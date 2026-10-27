
/* REBOOT VERDE - INDICADORES ANIMADOS */

document.addEventListener("DOMContentLoaded", () => {

    const contadores = document.querySelectorAll(".contador");

    function formatarNumero(numero) {
        return new Intl.NumberFormat("pt-BR").format(numero);
    }

    function animarContador(elemento) {
        const valorFinal = Number(elemento.dataset.target);
        const duracao = 1800;
        const inicio = performance.now();

        function atualizar(tempoAtual) {
            const progresso = Math.min(
                (tempoAtual - inicio) / duracao,
                1
            );

            const suavizado = 1 - Math.pow(1 - progresso, 3);
            const valorAtual = Math.floor(valorFinal * suavizado);

            elemento.textContent = formatarNumero(valorAtual);

            if (progresso < 1) {
                requestAnimationFrame(atualizar);
            } else {
                elemento.textContent = formatarNumero(valorFinal);
            }
        }

        requestAnimationFrame(atualizar);
    }

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    const contador = entrada.target;

                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                        contador.textContent = formatarNumero(
                            Number(contador.dataset.target)
                        );
                    } else {
                        animarContador(contador);
                    }

                    observador.unobserve(contador);
                }
            });
        }, {
            threshold: 0.5
        });

        contadores.forEach((contador) => {
            observador.observe(contador);
        });
    } else {
        contadores.forEach((contador) => {
            contador.textContent = formatarNumero(
                Number(contador.dataset.target)
            );
        });
    }

});

/* ===================================
   GALERIA INTERATIVA
   =================================== */

document.addEventListener("DOMContentLoaded", () => {

    const itensGaleria = document.querySelectorAll(".galeria-item");
    const modal = document.getElementById("galeriaModal");
    const imagemAmpliada = document.getElementById("galeriaImagemAmpliada");
    const legenda = document.getElementById("galeriaLegenda");
    const botaoFechar = document.querySelector(".galeria-fechar");

    if (!modal || !imagemAmpliada || !legenda || !botaoFechar) {
        return;
    }

    let ultimoItemSelecionado = null;

    function fecharGaleria() {
        modal.classList.remove("ativo");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-aberto");
        imagemAmpliada.removeAttribute("src");

        if (ultimoItemSelecionado) {
            ultimoItemSelecionado.focus();
        }
    }

    itensGaleria.forEach((item) => {
        item.addEventListener("click", () => {

            const imagem = item.querySelector("img");
            const titulo = item.querySelector("span");

            if (!imagem) return;

            ultimoItemSelecionado = item;
            imagemAmpliada.src = imagem.src;
            imagemAmpliada.alt = imagem.alt;
            legenda.textContent = titulo ? titulo.textContent : "";

            modal.classList.add("ativo");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-aberto");
            botaoFechar.focus();
        });
    });

    botaoFechar.addEventListener("click", fecharGaleria);

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharGaleria();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (!modal.classList.contains("ativo")) return;

        if (evento.key === "Escape") {
            fecharGaleria();
        }

        if (evento.key === "Tab") {
            evento.preventDefault();
            botaoFechar.focus();
        }
    });

});


/* ===================================
   COMO AJUDAR
   =================================== */

document.addEventListener("DOMContentLoaded", () => {

    const botoesAjuda = document.querySelectorAll(
        ".ajudar-btn"
    );

    botoesAjuda.forEach((botao) => {

        botao.addEventListener("click", () => {

            const interesse = botao.dataset.interesse;

            sessionStorage.setItem(
                "rebootVerdeInteresse",
                interesse
            );

        });

    });

});


/* ===================================
   CONTATO - FORMULÁRIO
   =================================== */

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formContato");
    const campoAssunto = document.getElementById("assunto");
    const feedback = document.getElementById("formFeedback");

    if (!formulario || !campoAssunto || !feedback) return;

    function atualizarAssunto() {
        const interesse = sessionStorage.getItem(
            "rebootVerdeInteresse"
        );

        const assuntosValidos = Array.from(
            campoAssunto.options
        ).map(opcao => opcao.value);

        if (interesse && assuntosValidos.includes(interesse)) {
            campoAssunto.value = interesse;
            sessionStorage.removeItem("rebootVerdeInteresse");
        }
    }

    // Integra os botões da seção Como Ajudar
    document.querySelectorAll(".ajudar-btn").forEach(botao => {
        botao.addEventListener("click", () => {
            campoAssunto.value = botao.dataset.interesse;
        });
    });

    atualizarAssunto();

    function validarCampo(id, erroId, mensagem) {
        const campo = document.getElementById(id);
        const erro = document.getElementById(erroId);

        if (!campo.value.trim()) {
            erro.textContent = mensagem;
            campo.classList.add("campo-invalido");
            return false;
        }

        erro.textContent = "";
        campo.classList.remove("campo-invalido");
        return true;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        feedback.textContent = "";
        feedback.className = "form-feedback";

        const nomeValido = validarCampo(
            "nome", "erroNome", "Informe seu nome."
        );

        const emailValido = validarCampo(
            "email", "erroEmail", "Informe seu e-mail."
        );

        const assuntoValido = validarCampo(
            "assunto", "erroAssunto", "Selecione um assunto."
        );

        const mensagemValida = validarCampo(
            "mensagem", "erroMensagem", "Escreva sua mensagem."
        );

        const email = document.getElementById("email");
        let formatoEmailValido = true;

        if (emailValido && !email.validity.valid) {
            document.getElementById("erroEmail").textContent =
                "Digite um e-mail válido.";
            email.classList.add("campo-invalido");
            formatoEmailValido = false;
        }

        if (
            nomeValido &&
            emailValido &&
            formatoEmailValido &&
            assuntoValido &&
            mensagemValida
        ) {

            if (
                nomeValido &&
                emailValido &&
                formatoEmailValido &&
                assuntoValido &&
                mensagemValida
            ) {
                feedback.textContent =
                    "Mensagem validada com sucesso! " +
                    "Esta e uma simulacao academica: " +
                    "nenhum dado foi enviado.";

                feedback.classList.add("sucesso");

                formulario.reset();
            }


            feedback.classList.add("sucesso");

            formulario.reset();
        }
    });

});


/* ===================================
   LINKS DO RODAPÉ
   =================================== */

document.addEventListener("DOMContentLoaded", () => {

    const linksRodape = document.querySelectorAll(
        ".ajudar-btn-link"
    );

    const campoAssunto = document.getElementById("assunto");

    linksRodape.forEach((link) => {

        link.addEventListener("click", () => {

            const interesse = link.dataset.interesse;

            if (campoAssunto) {
                campoAssunto.value = interesse;
            }

            sessionStorage.setItem(
                "rebootVerdeInteresse",
                interesse
            );

        });

    });

});


/* ===================================
   MENU MOBILE
   =================================== */

document.addEventListener("DOMContentLoaded", () => {

    const botaoMenu = document.getElementById("menuToggle");
    const menu = document.getElementById("menuPrincipal");

    if (!botaoMenu || !menu) return;

    function fecharMenu() {
        menu.classList.remove("menu-aberto");
        botaoMenu.classList.remove("ativo");

        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
    }

    botaoMenu.addEventListener("click", () => {

        const aberto = menu.classList.toggle("menu-aberto");

        botaoMenu.classList.toggle("ativo", aberto);

        botaoMenu.setAttribute(
            "aria-expanded",
            String(aberto)
        );

        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );
    });

    // Fecha ao selecionar uma seção
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", fecharMenu);
    });

    // Fecha ao pressionar Esc
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            fecharMenu();
        }
    });

    // Fecha ao voltar para a versão desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            fecharMenu();
        }
    });

});

