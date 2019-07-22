export interface Message {
    date: Date;
    app: string;
    device: string;
    subject: string;
    from: string;
    body: any;
}
