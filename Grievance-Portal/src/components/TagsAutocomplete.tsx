import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip } from "@mui/material";

interface TagsInput {
    name: string;
    state: string[];
    setState: (newState: string[]) => void;
    tags: string[];
}

const TagsAutoComplete = (props: TagsInput) => {
    const { name, state, setState, tags } = props;
    
    function truncateTags(option: string) {
        const maxLength = 12; // Maximum number of characters to display
        return option.length > maxLength ? option.substring(0, maxLength - 2)  + '...' : option;
    };

    return (
        <label className="flex gap-4 items-center text-sm md:text-base w-full md:w-[600px]">
            {name}
            <Autocomplete multiple limitTags={3} options={tags} getOptionLabel={(dept) => dept} disableClearable onChange={(_, value) => setState([...value])} className="bg-white rounded-2xl w-full"
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} label={truncateTags(option)} className="flex justify-center items-center" />
                ))}
                renderInput={(params) => (
                    <TextField {...params} className="flex gap-10" placeholder={state.length ? "" :"Ex: PAT"} />
                )} />
        </label>
    )
}

export default TagsAutoComplete;