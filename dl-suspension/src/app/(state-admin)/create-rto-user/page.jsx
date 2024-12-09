import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CardWithInputs() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please provide your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" action={`#`}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="" required/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="" required/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="contactNo">Contact No</Label>
                <Input id="contactNo" placeholder="" type="tel" maxLength="10" required/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rto">RTO Preference</Label>
                <Select>
                  <SelectTrigger id="rto">
                    <SelectValue placeholder="Select RTO preference" required/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RTO001">RTO001</SelectItem>
                    <SelectItem value="RTO002">RTO002</SelectItem>
                    <SelectItem value="RTO003">RTO003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
  </div>
  )
}