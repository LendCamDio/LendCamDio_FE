import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

export function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1 items-center text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <FontAwesomeIcon
          key={i}
          icon={
            value >= i ? faStar : value >= i - 0.5 ? faStarHalfAlt : faStarEmpty
          }
          className="w-4 h-4"
        />
      ))}
    </div>
  );
}
