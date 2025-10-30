import { PageProps } from '@inertiajs/core';
import { Page } from '@inertiajs/inertia';

declare global {
  // Déclaration de la fonction route()
  function route(name: string, params?: any, absolute?: boolean): string;
  function route(
    name: string,
    params?: any,
    options?: {
      absolute?: boolean;
      [key: string]: any;
    }
  ): string;

  // Déclaration des types pour les propriétés de page Inertia
  interface InertiaPageProps extends PageProps {
    [key: string]: any;
  }

  // Déclaration du type pour la fonction usePage()
  function usePage<T = InertiaPageProps>(): {
    props: T;
    component: string;
    url: string;
    version: string | null;
    scrollRegions: Array<{ top: number; left: number }>;
    remember: (key: string, value?: any) => any;
  };
}
