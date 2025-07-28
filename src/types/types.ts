export type ImageProjectProps = {
    id: number;
    type: string;
    image: string;
    title?: string;
    description?: string;
    technologies?: string[];
    link?: string;
}

export type ItemTabContainerProps = {
    typeList: string;
    items: ImageProjectProps[];
}