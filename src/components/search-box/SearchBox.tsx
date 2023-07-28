import * as React from "react";
import {useCallback, useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import {styled} from '@mui/material/styles';
import InputBase from "@mui/material/InputBase";
import {Box} from "@mui/material";

const Search = styled('div')(({theme}: any) => ({
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    borderRadius: '30px',
    backgroundColor: '#eee',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '700px',
    height: '50px',
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width:'500px',
        [theme.breakpoints.up('sm')]: {
            width: '80ch',
            height: '3ch',
        },
    },
}));
const SearchBox = () => {
    const [isDisableCancelIcon, setIsDisableCancelIcon] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState('');
    const onChangeGlobalSearch = useCallback(
        (e: any) => {
            const value = e.target.value;

            setSearchValue(value);

            if (value.toString().length) {
                setIsDisableCancelIcon(false);
            } else {
                setIsDisableCancelIcon(true);
            }
        },
        [isDisableCancelIcon],
    );

    return (
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Search>
            <SearchIconWrapper>
                <SearchIcon color={'primary'}/>
            </SearchIconWrapper>
            <StyledInputBase
                value={searchValue}
                placeholder={`Search`}
                inputProps={{'aria-label': 'search'}}
                onChange={onChangeGlobalSearch}
            />
            <IconButton
                disabled={isDisableCancelIcon}
                onClick={() => {
                    setIsDisableCancelIcon(true);
                    setSearchValue('');
                }}>
                <CancelIcon/>
            </IconButton>
        </Search>
        </Box>
    );
};

export default SearchBox;
