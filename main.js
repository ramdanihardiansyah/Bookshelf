// menyimpan data ke local sorage
const STORAGE_KEY = 'BOOKSHELF_APP';

let books = [];

function simpanBuku() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function muatBuku() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        books = JSON.parse(data);
    }
}

function buatElemenBuku(buku) {
    const item = document.createElement('div');
    item.setAttribute('data-bookid', buku.id);
    item.setAttribute('data-testid', 'bookItem');
    item.classList.add('book-item');

// Isi konten buku
    item.innerHTML = `
        <h3 data-testid="bookItemTitle">${buku.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${buku.author}</p>
        <p data-testid="bookItemYear">Tahun: ${buku.year}</p>
        <div class="book-actions">
        <button data-testid="bookItemIsCompleteButton">
            ${buku.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
    `;

// Tombol selesai / belum selesai
    item.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', function () {
        ubahStatusBuku(buku.id);
    });

    // tombol hapus
    item.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', function () {
        if (confirm('Yakin ingin menghapus buku "' + buku.title + '"?')) {
        hapusBuku(buku.id);
        }
    });

    // tombol edit
    item.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', function () {
        editBuku(buku.id);
    });

    return item;
}

//fungsi menampilkan buku

function tampilkanBuku(kataCari) {
    const rakBelumSelesai = document.getElementById('incompleteBookList');
    const rakSelesai = document.getElementById('completeBookList');

    // mengosongkan rak
    rakBelumSelesai.innerHTML = '';
    rakSelesai.innerHTML = '';

    // filter mencari bukuyang di tulis
    let bukuYangDitampilkan = books;
    if (kataCari) {
        bukuYangDitampilkan = books.filter(function (buku) {
        return buku.title.toLowerCase().includes(kataCari.toLowerCase());
        });
    }

    bukuYangDitampilkan.forEach(function (buku) {
        const elemenBuku = buatElemenBuku(buku);
        if (buku.isComplete) {
        rakSelesai.appendChild(elemenBuku);
        } else {
        rakBelumSelesai.appendChild(elemenBuku);
        }
    });
}

//menambahkan buku

function tambahBuku(title, author, year, isComplete) {
    const bukuBaru = {
        id: +new Date(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
    };
    books.push(bukuBaru);
    simpanBuku();
    tampilkanBuku();
}

function ubahStatusBuku(id) {
    const buku = books.find(function (b) { return b.id === id; });
    if (buku) {
        buku.isComplete = !buku.isComplete;
        simpanBuku();
        tampilkanBuku();
    }
}

function hapusBuku(id) {
    books = books.filter(function (b) { return b.id !== id; });
    simpanBuku();
    tampilkanBuku();
}

function editBuku(id) {
    const buku = books.find(function (b) { return b.id === id; });
    if (!buku) return;

    const newTitle = prompt('Judul buku:', buku.title);
    if (newTitle === null) return;

     const newAuthor = prompt('Penulis:', buku.author);
    if (newAuthor === null) return;

    const newYear = prompt('Tahun:', buku.year);
    if (newYear === null) return;

    // Update data buku
    buku.title = newTitle.trim() || buku.title;
    buku.author = newAuthor.trim() || buku.author;
    buku.year = parseInt(newYear) || buku.year;

    simpanBuku();
    tampilkanBuku();
}

document.addEventListener('DOMContentLoaded', function () {
    muatBuku();
    tampilkanBuku();

// from menambah buku
    const formTambah = document.getElementById('bookForm');
    const checkboxSelesai = document.getElementById('bookFormIsComplete');
    const tombolSubmit = document.getElementById('bookFormSubmit');

    checkboxSelesai.addEventListener('change', function () {
        const span = tombolSubmit.querySelector('span');
        if (checkboxSelesai.checked) {
            span.textContent = 'Selesai dibaca';
        } else {
            span.textContent = 'Belum selesai dibaca';
        }
});

formTambah.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value.trim();
    const author = document.getElementById('bookFormAuthor').value.trim();
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = checkboxSelesai.checked;

    tambahBuku(title, author, year, isComplete);
    formTambah.reset();
    tombolSubmit.querySelector('span').textContent = 'Belum selesai dibaca';
});

// form nyari buku
const formCari = document.getElementById('searchBook');
const inputCari = document.getElementById('searchBookTitle');

// Cari saat form di kirim
formCari.addEventListener('submit', function (event) {
    event.preventDefault();
    tampilkanBuku(inputCari.value);
});

// nyari otomatis buku yang dicari
inputCari.addEventListener('input', function () {
    tampilkanBuku(inputCari.value);
    });
});