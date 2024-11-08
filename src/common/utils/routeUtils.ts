import { matchRoutes, useLocation } from "react-router-dom"
import routes from 'config/routes';

export function isSmallPageVersion(){
    const location = useLocation()
    return location?.pathname.includes('/small');
}
