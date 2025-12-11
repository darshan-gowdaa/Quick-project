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
('Sholay: The Final Cut', 'Action', 'Classic action drama.', 'https://picsum.photos/id/1024/400/600', 0.0, 'U', 'Hindi', 0, 8200),
('Dhurandhar', 'Action', 'Intense action feature.', 'https://picsum.photos/id/1025/400/600', 9.2, 'A', 'Hindi', 88300, 0),
('Akhanda 2: Thaandavam', 'Action', 'Epic sequel with high stakes.', 'https://picsum.photos/id/1026/400/600', 0.0, 'UA16+', 'Telugu, Hindi, Tamil, Kannada', 0, 341000),
('Kis Kisko Pyaar Karoon 2', 'Comedy', 'Lighthearted comedy sequel.', 'https://picsum.photos/id/1027/400/600', 0.0, 'UA16+', 'Hindi', 0, 47200),
('Padayappa', 'Drama', 'Revenge and redemption.', 'https://picsum.photos/id/1028/400/600', 0.0, 'U', 'Tamil', 0, 0),
('The Devil', 'Action', 'Stylish action thriller.', 'https://picsum.photos/id/1029/400/600', 0.0, 'UA16+', 'Kannada', 195000, 0),
('Avatar: Fire and Ash', 'Fantasy', 'Mythic fantasy adventure.', 'https://picsum.photos/id/1030/400/600', 0.0, 'UA16+', 'English, Kannada, Malayalam, Telugu', 1300000, 0),
('Zootopia 2', 'Family', 'Animated adventure sequel.', 'https://picsum.photos/id/1031/400/600', 9.1, 'UA7+', 'English, Hindi, Tamil, Telugu', 11300, 0),
('Tere Ishk Mein', 'Drama', 'Romantic drama.', 'https://picsum.photos/id/1032/400/600', 8.3, 'UA16+', 'Hindi, Tamil', 68800, 0),
('Kalamkaval', 'Thriller', 'Malayalam thriller.', 'https://picsum.photos/id/1033/400/600', 8.7, 'UA16+', 'Malayalam', 35800, 0),
('Eko', 'Drama', 'Emotional family drama.', 'https://picsum.photos/id/1034/400/600', 9.2, 'UA16+', 'Malayalam', 40400, 0),
('Vaa Vaathiyaar', 'Action', 'Action-packed entertainer.', 'https://picsum.photos/id/1035/400/600', 0.0, 'UA7+', 'Tamil', 13600, 0),
('Kantara: A Legend Chapter-1', 'Action', 'Mythic action prequel.', 'https://picsum.photos/id/1036/400/600', 9.3, 'UA16+', 'Kannada, Telugu, Hindi, Tamil', 561000, 0),
('Acharya Sri Shankara', 'Drama', 'Spiritual historical drama.', 'https://picsum.photos/id/1037/400/600', 9.0, 'U', 'Kannada', 0, 0),
('The Girlfriend', 'Thriller', 'Suspenseful relationship thriller.', 'https://picsum.photos/id/1038/400/600', 8.6, 'UA13+', 'Telugu, Hindi, Tamil, Kannada', 21500, 0),
('Vishwaroopini Sri Vasavi', 'Drama', 'Epic biographical drama.', 'https://picsum.photos/id/1039/400/600', 9.4, 'U', 'Kannada', 30, 0);

