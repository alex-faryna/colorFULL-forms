
export class RoutesConfig {
    public static dashboard = 'dashboard';
    public static profile = 'profile';
    public static sprintExamplePage = `${RoutesConfig.dashboard}/sprint`;
    public static page = `${RoutesConfig.dashboard}/:pageId`;
}
