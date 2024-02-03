import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Box, Button, Chip, Stack, Typography } from "@mui/joy";
import { useMutation } from "convex/react";
import { useState } from "react";
import DishEditor from "./DishEditor";
import { WithoutSystemFields } from "convex/server";

export interface DishDisplayProps {
  dish: Dish;
  isEditable?: boolean;
  showDots?: boolean;
}

const DishDisplay = ({
  dish,
  isEditable = false,
  showDots = false,
}: DishDisplayProps) => {
  const deleteDish = useMutation(api.dishes.deleteDish);
  const patchDish = useMutation(api.dishes.patch);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (
    updatedDish: Omit<WithoutSystemFields<Dish>, "mealId">
  ) => {
    patchDish({
      dishId: dish._id,
      updatedDish: { ...updatedDish, mealId: dish.mealId },
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return <DishEditor dish={dish} onSave={handleSave} />;
  }

  return (
    <Stack flex="1">
      <Stack direction="row" gap={1} flexWrap="wrap">
        <Typography fontWeight="bold" my="auto">
          {dish.name}
        </Typography>
        {showDots && (
          <Box
            sx={(theme) => ({
              borderBottom: `0.2rem dotted ${theme.vars.palette.neutral[300]}`,
              marginBottom: "0.6rem",
            })}
            flex={1}
          />
        )}
        {isEditable && (
          <Box ml="auto">
            <Stack direction="row" gap={1}>
              <Button
                size="sm"
                color="neutral"
                variant="soft"
                onClick={() => setIsEditing(true)}
              >
                edit
              </Button>
              <Button
                size="sm"
                color="neutral"
                variant="soft"
                onClick={() => deleteDish({ dishId: dish._id })}
              >
                remove
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>

      <Typography level="body-sm">{dish.description}</Typography>
      {dish.tags.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" mt={1}>
          {dish.tags.map((tag, i) => (
            <Chip key={i} variant="outlined">
              {tag}
            </Chip>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default DishDisplay;
