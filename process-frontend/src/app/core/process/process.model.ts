export interface Process {
    id: number;
    steps: Step[];
    currentStep: Step;
    nextStep: Step;
    backStep: Step;
}

export interface Step {
    id: string;
    name: string;
    url: string;
    type: StepType;
    order: number;
    completed: boolean;
    lastAcess?: Date;
    lastUpdate?: Date;
}

export enum StepType {
    process = 1,
    customization = 2
}
