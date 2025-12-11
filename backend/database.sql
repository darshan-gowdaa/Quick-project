CREATE DATABASE IF NOT EXISTS moviemania_db;

USE moviemania_db;

CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    poster_url VARCHAR(255) NOT NULL,
    rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
    certificate VARCHAR(10) NOT NULL DEFAULT 'UA',
    language VARCHAR(100) NOT NULL DEFAULT '',
    votes INT NOT NULL DEFAULT 0,
    likes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO movies (title, genre, description, poster_url, rating, certificate, language, votes, likes) VALUES
('Sholay: The Final Cut', 'Action', 'Classic action drama.', 'https://picsum.photos/seed/sholay/400/600', 0.0, 'U', 'Hindi', 0, 8200),
('Dhurandhar', 'Action', 'Intense action feature.', 'https://picsum.photos/seed/dhurandhar/400/600', 9.2, 'A', 'Hindi', 88300, 0),
('Akhanda 2: Thaandavam', 'Action', 'Epic sequel with high stakes.', 'https://picsum.photos/seed/akhanda2/400/600', 0.0, 'UA16+', 'Telugu, Hindi, Tamil, Kannada', 0, 341000),
('Kis Kisko Pyaar Karoon 2', 'Comedy', 'Lighthearted comedy sequel.', 'https://picsum.photos/seed/kiskisko2/400/600', 0.0, 'UA16+', 'Hindi', 0, 47200),
('Padayappa', 'Drama', 'Revenge and redemption.', 'https://picsum.photos/seed/padayappa/400/600', 0.0, 'U', 'Tamil', 0, 0),
('The Devil', 'Action', 'Stylish action thriller.', 'https://picsum.photos/seed/thedevil/400/600', 0.0, 'UA16+', 'Kannada', 195000, 0),
('Avatar: Fire and Ash', 'Fantasy', 'Mythic fantasy adventure.', 'https://picsum.photos/seed/avatarfire/400/600', 0.0, 'UA16+', 'English, Kannada, Malayalam, Telugu', 1300000, 0),
('Zootopia 2', 'Family', 'Animated adventure sequel.', 'https://picsum.photos/seed/zootopia2/400/600', 9.1, 'UA7+', 'English, Hindi, Tamil, Telugu', 11300, 0),
('Tere Ishk Mein', 'Drama', 'Romantic drama.', 'https://picsum.photos/seed/tereishk/400/600', 8.3, 'UA16+', 'Hindi, Tamil', 68800, 0),
('Kalamkaval', 'Thriller', 'Malayalam thriller.', 'https://picsum.photos/seed/kalamkaval/400/600', 8.7, 'UA16+', 'Malayalam', 35800, 0),
('Eko', 'Drama', 'Emotional family drama.', 'https://picsum.photos/seed/eko/400/600', 9.2, 'UA16+', 'Malayalam', 40400, 0),
('Vaa Vaathiyaar', 'Action', 'Action-packed entertainer.', 'https://picsum.photos/seed/vaavaathiyaar/400/600', 0.0, 'UA7+', 'Tamil', 13600, 0),
('Kantara: A Legend Chapter-1', 'Action', 'Mythic action prequel.', 'https://picsum.photos/seed/kantara/400/600', 9.3, 'UA16+', 'Kannada, Telugu, Hindi, Tamil', 561000, 0),
('Acharya Sri Shankara', 'Drama', 'Spiritual historical drama.', 'https://picsum.photos/seed/acharyasri/400/600', 9.0, 'U', 'Kannada', 0, 0),
('The Girlfriend', 'Thriller', 'Suspenseful relationship thriller.', 'https://picsum.photos/seed/thegirlfriend/400/600', 8.6, 'UA13+', 'Telugu, Hindi, Tamil, Kannada', 21500, 0),
('Vishwaroopini Sri Vasavi', 'Drama', 'Epic biographical drama.', 'https://picsum.photos/seed/vishwaroopini/400/600', 9.4, 'U', 'Kannada', 30, 0),
('Parallel Lines', 'Sci-Fi', 'When physics bends, friendships are tested.', 'https://picsum.photos/seed/parallellines/400/600', 8.7, 'UA13+', 'English', 2100, 9800),
('Crimson Harbor', 'Thriller', 'A dockside mystery under crimson skies.', 'https://picsum.photos/seed/crimsonharbor/400/600', 7.8, 'UA16+', 'English, Hindi', 1750, 6400),
('Garden of Echoes', 'Drama', 'Secrets surface in an old courtyard.', 'https://picsum.photos/seed/gardenechoes/400/600', 8.3, 'U', 'Hindi, English', 2200, 7200),
('Starlit Diner', 'Romance', 'Two chefs find love during night shifts.', 'https://picsum.photos/seed/starlitdiner/400/600', 8.1, 'U', 'English', 1400, 5200),
('Chai & Circuits', 'Comedy', 'A coder café where humor debugs life.', 'https://picsum.photos/seed/chaicircuits/400/600', 7.6, 'U', 'Hindi, English', 1100, 4300),
('Last Monsoon', 'Adventure', 'An expedition races the final rains.', 'https://picsum.photos/seed/lastmonsoon/400/600', 8.0, 'UA13+', 'English, Hindi', 1600, 5800);

