import { Menusvg } from './svgPack'
import { GuestNav, HomeLink, UserNav, DropButton , DropUserButton } from "./pageParts";

export default function Heading() {
  return (
    <header>
      <section className="header">
        <HomeLink><h1>Cod-<em className="short_logo">en+</em></h1></HomeLink>
        <UserNav />
        <GuestNav />
        <div className="flex gap-2.5">
          <DropButton props={{text: Menusvg()}}/>
          <DropUserButton />
        </div>
      </section>
    </header>
  )
}
