import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Atom,
  Book,
  BookMarked,
  Code2,
  Combine,
  CreditCard,
  File,
  FileText,
  Loader2,
  LogOut,
  LucideProps,
  MessageSquare,
  MessagesSquare,
  Settings,
  User,
} from "lucide-react";

export type Icon = keyof typeof Icons;

export const Icons = {
  User,
  CreditCard,
  LogOut,
  Settings,
  Book,
  BookMarked,
  Code2,
  Combine,
  FileText,
  File,
  MessageSquare,
  Atom,
  MessagesSquare,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Loader2,
};

export type DynamicIconProps = Omit<
  {
    icon: Icon;
  } & LucideProps,
  "name"
>;

export function DynamicIcon(props: DynamicIconProps) {
  const { icon, ...rest } = props;
  const Icon = Icons[icon];
  return <Icon {...rest} />;
}
