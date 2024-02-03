import { DietTags, Dish } from "@/convex/dishes";
import { Add, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@mui/joy";
import { WithoutSystemFields } from "convex/server";
import { useRef, useState } from "react";

export interface DishEditorProps {
  dish: Partial<Dish>;
  onSave: (dish: Omit<WithoutSystemFields<Dish>, "mealId">) => void;
  isNew?: boolean;
}

const DishEditor = ({ dish, onSave, isNew = false }: DishEditorProps) => {
  const [name, setName] = useState(dish.name ?? "");
  const [description, setDescription] = useState(dish.description ?? "");
  const [tags, setTags] = useState<string[]>(dish.tags ?? []);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (name !== "") {
      onSave({ name, tags, description });
      setName("");
      setDescription("");
      setTags([]);
      editorRef.current?.scrollIntoView();
    }
  };

  return (
    <Stack gap={1} width="100%" ref={editorRef}>
      <FormControl>
        {isNew && <FormLabel>Add a new dish</FormLabel>}
        <Stack direction="row" gap={1}>
          <Input
            fullWidth
            size="md"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleSave();
              }
            }}
            placeholder="name of your dish"
          />
          <Button
            startDecorator={isNew ? <Add /> : <Save />}
            onClick={handleSave}
          >
            {isNew ? "Add" : "Save"}
          </Button>
        </Stack>
      </FormControl>
      <FormControl>
        <FormLabel>Tags</FormLabel>
        <Autocomplete
          options={[...Object.values(DietTags)]}
          value={tags}
          onChange={(_event, newValue) => setTags(newValue)}
          multiple
          freeSolo
          sx={{ flex: 1 }}
          variant="soft"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description (optional)</FormLabel>
        <Textarea
          size="md"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="special notes, ingredients, allergens, etc."
          variant="soft"
        />
      </FormControl>
    </Stack>
  );
};

export default DishEditor;
