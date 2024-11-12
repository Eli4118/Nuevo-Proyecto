const apiKey = 'live_6FI20nCxojQluGOtfhw2kdWbF682XN3L5bqnz4wtZzVBiBR9st6ce6w5zPI8a6E1';
const url = `https://api.thecatapi.com/v1/images/search?limit=5&has_breeds=1&api_key=${apiKey}`;

let gatos = [];
let slideIndex = 0;

// Obtener datos de la API
const obtenerGatos = async () => {
    try {
        const response = await fetch(url);
        gatos = await response.json();
        cargarOpcionesOrigen();
        mostrarGatos(gatos);
    } catch (error) {
        console.error("Error al obtener los gatos:", error);
    }
};

// Cargar opciones de origen en el filtro
const cargarOpcionesOrigen = () => {
    const origenFiltro = document.getElementById("origenFiltro");
    origenFiltro.innerHTML = '<option value="">Todos</option>';
    
    const origenesUnicos = [...new Set(gatos.map(gato => gato.breeds[0]?.origin).filter(Boolean))];
    
    origenesUnicos.forEach(origen => {
        const option = document.createElement("option");
        option.value = origen;
        option.textContent = origen;
        origenFiltro.appendChild(option);
    });
};

// Filtrar por origen
const filtrarPorOrigen = () => {
    const origenSeleccionado = document.getElementById("origenFiltro").value;
    const gatosFiltrados = origenSeleccionado === "" 
        ? gatos 
        : gatos.filter(gato => gato.breeds[0]?.origin === origenSeleccionado);
    mostrarGatos(gatosFiltrados, origenSeleccionado === "");
};

// Mostrar gatos en el carrusel
const mostrarGatos = (gatosFiltrados, isTodosSeleccionado) => {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '';

    if (gatosFiltrados.length === 0) {
        carouselInner.innerHTML = "<p>No hay gatos disponibles.</p>";
        return;
    }

    gatosFiltrados.forEach(gato => {
        const { url, breeds } = gato;
        const breed = breeds && breeds.length > 0 ? breeds[0] : null;

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item', 'active');

        carouselItem.innerHTML = `
            <div class="carousel-item__image">
                <img src="${url}" alt="Gato" />
            </div>
            <div class="carousel-item__info">
                <h3>${breed ? breed.name : 'Gato sin raza'}</h3>
                <p><strong>Origen:</strong> ${breed ? breed.origin : 'Desconocido'}</p>
                <p><strong>Características:</strong> ${breed ? breed.temperament : 'Desconocido'}</p>
                <p><strong>Vida:</strong> ${breed ? breed.life_span : 'Desconocida'} años</p>
            </div>
        `;
        carouselInner.appendChild(carouselItem);
    });
    slideIndex = 0;
    mostrarSlide(slideIndex);
};

// Mostrar slide activo
const mostrarSlide = (n) => {
    const slides = document.getElementsByClassName("carousel-item");

    Array.from(slides).forEach(slide => slide.classList.remove("active"));
    slides[n].classList.add("active");
};

// Mover el carrusel
const moverCarrusel = (n) => {
    const slides = document.getElementsByClassName("carousel-item");

    slides[slideIndex].classList.remove("active");
    slideIndex += n;
    slideIndex = (slideIndex + slides.length) % slides.length;

    mostrarSlide(slideIndex);
};

// Obtener los gatos al cargar la página
window.onload = obtenerGatos;
