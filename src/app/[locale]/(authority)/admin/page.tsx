import React from 'react'

const AdminPage = () => {
  return (
    <div>
      Admin (authority signer)
Instruction	Description
initialize	Create Config PDA, XP mint (Token-2022), auto-register authority MinterRole
update_config	Rotate backend signer, optionally deactivate old MinterRole
create_course	Create a course PDA with lessons, XP rewards, prerequisites
update_course	Update content, toggle active, change XP/reward settings
register_minter	Register an external XP minter with per-call cap
revoke_minter	Close MinterRole PDA, reclaim rent
create_achievement_type	Define achievement badge with Metaplex Core collection
deactivate_achievement_type	Disable further awards for an achievement


      
    </div>
  )
}

export default AdminPage