import * as React from "react";
import {useState} from "react";
import {Box, Card, CardContent, Typography, useTheme,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import {tokens} from "../../theme/theme";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
const Home = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [wordMeaningData, setWordMeaningData] = useState<any>([]);
    const [paramFilter, setParamFilter] = useState(null);


    const handleSearch = async () => {
        try {
            console.log('se')
            const response = await fetch(`http://localhost:5000/api/wordMeaningData?word=${paramFilter}`);
            const wordMeaningData = await response.json();
            console.log(wordMeaningData)
            setWordMeaningData(wordMeaningData);
        } catch (error) {
            console.error("Error fetching wordMeaningData:", error);
        }
    };


    return (
        <Box m="20px">
            <Box mb="20px">
                <Typography variant="h6" color={colors.greenAccent[400]}>
                    Please input word here...
                </Typography>
            </Box>

            {/* SEARCH BAR */}
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>


            {wordMeaningData.length && (
                <Card sx={{marginTop: "20px"}}>
                    <CardContent>
                        <Typography variant="h6">{`Word: ${paramFilter}`}</Typography>
                        <Typography variant="body1">{`Meaning: ${wordMeaningData[0].meaning}`}</Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default Home;
