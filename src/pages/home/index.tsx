import * as React from "react";
// import { useState } from "react";
import { Typography, Paper } from "@mui/material";
// import { tokens } from "../../theme/theme";

const Home = () => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    // const [inputValue, setInputValue] = useState("");
    //
    // const handleInputChange = (e: any) => {
    //     const inputValue = e.target.value;
    //
    //     // Convert the input text using Avro JS
    // };

    return (
        <div>
            <Typography variant="h2" style={{ textAlign: "center" }}>
                Welcome to Bangla Dictionary
            </Typography>

            <Paper style={{ padding: "16px", marginTop: "20px" }}>
                {/* Random description content */}
                <p>Welcome to the Online Bangla Dictionary - your comprehensive resource for all your Bengali language needs. Whether you're a native speaker looking for the meaning of a word or a language enthusiast eager to explore the rich linguistic heritage of Bangladesh and West Bengal, our web version is here to assist you.</p>

                <p>Our Online Bangla Dictionary is designed to provide quick and accurate translations, definitions, and explanations for a wide range of words and phrases in both Bengali and English. With a user-friendly interface and a vast database of words, you can easily navigate through the world of Bengali language and culture.</p>

                <p>Key features of our web version include:</p>

                <ol>
                    <li><strong>Bilingual Search:</strong> Easily search for words or phrases in both Bengali and English, ensuring you find the information you need, no matter which language you're comfortable with.</li>
                    <li><strong>Detailed Definitions:</strong> Get in-depth definitions, synonyms, antonyms, and usage examples to understand the context and nuances of each word.</li>
                    {/*<li><strong>Audio Pronunciations:</strong> Hear the correct pronunciation of words in Bengali, helping you improve your language skills.</li>*/}
                    <li><strong>Word of the Day:</strong> Learn a new Bengali word every day and expand your vocabulary.</li>
                    <li><strong>Language Learning Resources:</strong> Explore grammar guides, language tips, and cultural insights to enhance your understanding of Bengali.</li>
                    <li><strong>Mobile-Friendly:</strong> Access our dictionary on your smartphone or tablet, making it convenient to use on the go.</li>
                    <li><strong>Bookmark and Save:</strong> Save your favorite words for easy access in the future.</li>
                </ol>

                <p>Whether you're a student, traveler, or simply curious about the Bengali language, our Online Bangla Dictionary is your go-to resource. Start exploring the beauty of Bengali language and culture today!</p>
            </Paper>
        </div>
    );
};

export default Home;
