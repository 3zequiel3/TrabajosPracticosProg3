document.addEventListener('DOMContentLoaded', function () {
    // Cargar el layout del navbar/sidebar desde layouts/sidebar.html
    const layoutDiv = document.getElementById('layout-navbar');
    if (layoutDiv) {
        fetch('layouts/sidebar.html')
            .then(res => res.text())
            .then(html => {
                layoutDiv.innerHTML = html;
                // Reasignar eventos del menú hamburguesa
                const menuBtn = document.getElementById('menuBtn');
                const sideMenu = document.getElementById('sideMenu');
                const closeMenu = document.getElementById('closeMenu');
                const menuBackdrop = document.getElementById('menuBackdrop');
                if (menuBtn && sideMenu && closeMenu && menuBackdrop) {
                    menuBtn.onclick = function () {
                        sideMenu.style.display = 'block';
                        menuBackdrop.style.display = 'block';
                    };
                    closeMenu.onclick = function () {
                        sideMenu.style.display = 'none';
                        menuBackdrop.style.display = 'none';
                    };
                    menuBackdrop.onclick = function () {
                        sideMenu.style.display = 'none';
                        menuBackdrop.style.display = 'none';
                    };
                }
            });
    }
    // Menú hamburguesa lateral
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');

    if (menuBtn && sideMenu && closeMenu && menuBackdrop) {
        menuBtn.onclick = function () {
            sideMenu.style.display = 'block';
            menuBackdrop.style.display = 'block';
        };
        closeMenu.onclick = function () {
            sideMenu.style.display = 'none';
            menuBackdrop.style.display = 'none';
        };
        menuBackdrop.onclick = function () {
            sideMenu.style.display = 'none';
            menuBackdrop.style.display = 'none';
        };
    }

    const form = document.getElementById('form-registro');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const usuario = {
                nombre: form.nombre.value,
                email: form.email.value,
                password: form.password.value
            };
            let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            // Evitar emails duplicados
            if (usuarios.some(u => u.email === usuario.email)) {
                mostrarMensaje('El email ya está registrado.', true);
                return;
            }
            usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            mostrarMensaje('Registro guardado localmente.', false);
            form.reset();
        });
    }

    function mostrarMensaje(msg, error) {
        const mensaje = document.getElementById('registro-mensaje');
        if (mensaje) {
            mensaje.textContent = msg;
            mensaje.className = error ? 'text-danger mt-3' : 'text-success mt-3';
        }
    }
    // BLOG: lógica para mostrar artículos (solo visualización)
    const blogList = document.getElementById('blog-list');
    if (blogList && !document.getElementById('form-blog')) {
        let articulos = JSON.parse(localStorage.getItem('articulos') || '[]');
        blogList.innerHTML = '';
        if (articulos.length === 0) {
            blogList.innerHTML = '<p class="text-light">No hay artículos publicados.</p>';
        } else {
            articulos.forEach(art => {
                const card = document.createElement('div');
                card.className = 'card mb-3 bg-dark text-light';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${art.titulo}</h5>
                        <p class="card-text">${art.contenido}</p>
                    </div>
                `;
                blogList.appendChild(card);
            });
        }
    }

    // NUEVO-ARTICULO: lógica para crear y eliminar artículos
    const blogForm = document.getElementById('form-blog');
    const blogMensaje = document.getElementById('blog-mensaje');
    if (blogForm && blogList) {
        renderBlogAdmin();
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const titulo = blogForm.titulo.value.trim();
            const contenido = blogForm.contenido.value.trim();
            if (!titulo || !contenido) {
                if (blogMensaje) {
                    blogMensaje.textContent = 'Completa todos los campos.';
                    blogMensaje.className = 'text-danger mt-3';
                }
                return;
            }
            let articulos = JSON.parse(localStorage.getItem('articulos') || '[]');
            articulos.unshift({ titulo, contenido });
            localStorage.setItem('articulos', JSON.stringify(articulos));
            renderBlogAdmin();
            blogForm.reset();
            if (blogMensaje) {
                blogMensaje.textContent = 'Artículo publicado.';
                blogMensaje.className = 'text-success mt-3';
            }
        });
    }

    function renderBlogAdmin() {
        let articulos = JSON.parse(localStorage.getItem('articulos') || '[]');
        blogList.innerHTML = '';
        if (articulos.length === 0) {
            blogList.innerHTML = '<p class="text-light">No hay artículos publicados.</p>';
            return;
        }
        articulos.forEach((art, idx) => {
            const card = document.createElement('div');
            card.className = 'card mb-3 bg-dark text-light blog-card-center';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${art.titulo}</h5>
                    <p class="card-text">${art.contenido}</p>
                    <button class="btn btn-danger btn-sm" data-idx="${idx}"><i class="bi bi-trash"></i></button>
                </div>
            `;
            blogList.appendChild(card);
        });
        blogList.querySelectorAll('button[data-idx]').forEach(btn => {
            btn.onclick = function() {
                eliminarArticulo(parseInt(btn.getAttribute('data-idx')));
            };
        });
    }

    function eliminarArticulo(idx) {
        let articulos = JSON.parse(localStorage.getItem('articulos') || '[]');
        articulos.splice(idx, 1);
        localStorage.setItem('articulos', JSON.stringify(articulos));
        renderBlogAdmin();
        if (blogMensaje) {
            blogMensaje.textContent = 'Artículo eliminado.';
            blogMensaje.className = 'text-success mt-3';
        }
    }
});