import axios from "axios";

const API_URL = "http://0.0.0.0:8000/getipa";

const handleIPA = async (inputValue: string): Promise<{ result: string | null, error: string | null }> => {


    try {
        const value = inputValue.trim();
        if (value.length > 0) {
            const { data: ipaData } = await axios.get(`${API_URL}?word=${inputValue}`);
            if (ipaData?.length) {
                return {
                    result: ipaData,
                    error: null,
                }
            } else {
                return {
                    result: null,
                    error: 'Invalid API response format. Expected response.data field.'
                }
            }
        }
        return { result: null, error: 'Input value is empty' };
    } catch (error) {
        return {
            result: null,
            error: (error as Error)?.message || 'An error occurred',
        }
    }
};

export default handleIPA;
