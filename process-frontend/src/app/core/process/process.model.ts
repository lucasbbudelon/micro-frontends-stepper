export interface Process {
    id: number;
    steps: Step[];
    currentStep: Step;
    nextStep: Step;
    backStep: Step;
    lastUpdate?: Date;
}

export interface Step {
    codeName: string;
    title: string;
    url: string;
    order: number;
    fields: Field[];
    completed: boolean;
    lastAcess?: Date;
    lastUpdate?: Date;
}

export interface Field {
    codeName: string;
    label: string;
    placeholder: string;
    value: string;
    required: boolean;
    options: string[];
    presentation: Presentation;
}

export interface Presentation {
    mask: string;
    pattern: string;
    placeholder: string;
    prefix: string;
    sufix: string;
}
