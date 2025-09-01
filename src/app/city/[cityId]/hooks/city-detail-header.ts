import { useRouter } from "next/navigation";

export const useCityDetailHeader = () => {
    const router = useRouter();
    const handleGoBack = () => {
        router.push('/');
      }

      return {
        handleGoBack,
      }
}