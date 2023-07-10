import { Response } from 'express'; 

export function badRequest(res: Response) {
    res.status(400).json({message: 'Bad Request'});
}

export function unauthAccess(res: Response) {
    res.status(401).json({message: 'Unauthorised Access'});
}

export function wrongCredentials(res: Response) {
    res.status(403).json({message: 'Wrong Credentials'});
}

export function serverError(res: Response, err: unknown) {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'});
}

export function notFound(res: Response) {
    res.status(404).json({message: 'Not Found'});
}

export function statusOkay(res: Response, message: any) {
    res.status(200).json(message);
}